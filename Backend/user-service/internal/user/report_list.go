package user

import (
	"context"
	"database/sql"
	pb "e_veda/proto/userpb"
	"fmt"
	"log"
	"math"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (s *Server) GetReportsList(ctx context.Context, req *pb.GetReportsListRequest) (*pb.GetReportsListResponse, error) {
	limit := int(req.GetLimit())
	if limit <= 0 {
		limit = 10
	}
	page := int(req.GetPage())
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	searchQuery := req.GetSearchQuery()
	userID := req.GetUserId()

	// Consider using LEFT JOIN if a missing user should not hide the report
	countQuery := `
       SELECT COUNT(*) 
       FROM reports_history r
       LEFT JOIN e_veda_users u ON r.user_uuid = u.iam_id
       WHERE 1=1`

	dataQuery := `
       SELECT r.id, u.name, r.report_creation_date, r.status,
              r.report_creation_time, r.accuracy_rate, r.confidence_rate, r.analysis_result
       FROM reports_history r
       LEFT JOIN e_veda_users u ON r.user_uuid = u.iam_id
       WHERE 1=1`

	var args []interface{}
	argCount := 1

	if userID != "" {
		countQuery += fmt.Sprintf(` AND r.user_uuid = $%d`, argCount)
		dataQuery += fmt.Sprintf(` AND r.user_uuid = $%d`, argCount)
		args = append(args, userID)
		argCount++
	}

	if searchQuery != "" {
		searchTerm := "%" + searchQuery + "%"
		countQuery += fmt.Sprintf(` AND (u.name ILIKE $%d OR r.status ILIKE $%d)`, argCount, argCount)
		dataQuery += fmt.Sprintf(` AND (u.name ILIKE $%d OR r.status ILIKE $%d)`, argCount, argCount)
		args = append(args, searchTerm)
		argCount++
	}

	var totalCount int
	err := s.db.QueryRowContext(ctx, countQuery, args...).Scan(&totalCount)
	if err != nil {
		log.Printf("Database error counting reports: %v", err)
		return nil, status.Error(codes.Internal, "Failed to fetch reports count")
	}

	// FIXED: Added r.id DESC as a tie-breaker for reliable pagination
	dataQuery += fmt.Sprintf(` ORDER BY r.report_creation_date DESC, r.id DESC LIMIT $%d OFFSET $%d`, argCount, argCount+1)
	args = append(args, limit, offset)

	rows, err := s.db.QueryContext(ctx, dataQuery, args...)
	if err != nil {
		log.Printf("Database error fetching reports data: %v", err)
		return nil, status.Error(codes.Internal, "Failed to fetch reports data")
	}
	defer rows.Close() // Simplified defer

	var reports []*pb.ReportSummary
	for rows.Next() {
		var r pb.ReportSummary

		// FIXED: Use sql.Null types for everything that could possibly be NULL
		var rawDate sql.NullString
		var patientName sql.NullString
		var statusStr sql.NullString
		var rawTime sql.NullString
		var accRate sql.NullFloat64
		var confRate sql.NullFloat64
		var analysisRes sql.NullString

		err := rows.Scan(
			&r.Id,
			&patientName,
			&rawDate,
			&statusStr,
			&rawTime,
			&accRate,
			&confRate,
			&analysisRes,
		)

		if err != nil {
			log.Printf("Error scanning report row for ID %v: %v", r.Id, err)
			continue
		}

		// Assign safe values
		if patientName.Valid {
			r.PatientName = patientName.String
		}
		if statusStr.Valid {
			r.Status = statusStr.String
		}

		// FIXED: Safe substring extraction
		if rawDate.Valid {
			if len(rawDate.String) >= 10 {
				r.Date = rawDate.String[:10]
			} else {
				r.Date = rawDate.String
			}
		}

		r.ReportType = "Full Analysis"
		if rawTime.Valid {
			r.Time = rawTime.String
		}

		if accRate.Valid {
			val := accRate.Float64
			r.AccuracyRate = &val
		}
		if confRate.Valid {
			val := confRate.Float64
			r.ConfidenceRate = &val
		}
		if analysisRes.Valid {
			val := analysisRes.String
			r.AnalysisResult = &val
		}

		reports = append(reports, &r)
	}

	totalPages := int32(math.Ceil(float64(totalCount) / float64(limit)))

	return &pb.GetReportsListResponse{
		Reports:     reports,
		TotalCount:  int32(totalCount),
		TotalPages:  totalPages,
		CurrentPage: int32(page),
	}, nil
}
