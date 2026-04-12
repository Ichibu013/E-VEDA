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
	// 1. Setup Pagination Defaults
	limit := int(req.GetLimit())
	if limit <= 0 {
		limit = 10 // Default to 10 items per page
	}
	page := int(req.GetPage())
	if page <= 0 {
		page = 1
	}
	offset := (page - 1) * limit

	searchQuery := req.GetSearchQuery()

	// 2. Base Queries
	countQuery := `
		SELECT COUNT(*) 
		FROM reports_history r
		JOIN e_veda_users u ON r.user_uuid = u.iam_id
		WHERE 1=1`

	dataQuery := `
		SELECT r.id, u.name, r.report_creation_date, r.status,
		       r.report_creation_time, r.accuracy_rate, r.confidence_rate, r.analysis_result
		FROM reports_history r
		JOIN e_veda_users u ON r.user_uuid = u.iam_id
		WHERE 1=1`

	var args []interface{}
	argCount := 1

	// 3. Apply Search Filter if provided
	if searchQuery != "" {
		searchTerm := "%" + searchQuery + "%"
		countQuery += fmt.Sprintf(` AND (u.name ILIKE $%d OR r.status ILIKE $%d)`, argCount, argCount)
		dataQuery += fmt.Sprintf(` AND (u.name ILIKE $%d OR r.status ILIKE $%d)`, argCount, argCount)
		args = append(args, searchTerm)
		argCount++
	}

	// 4. Get Total Count (Needed for frontend pagination numbers)
	var totalCount int
	err := s.db.QueryRowContext(ctx, countQuery, args...).Scan(&totalCount)
	if err != nil {
		log.Printf("Database error counting reports: %v", err)
		return nil, status.Error(codes.Internal, "Failed to fetch reports count")
	}

	// 5. Fetch Paginated Data
	dataQuery += fmt.Sprintf(` ORDER BY r.report_creation_date DESC LIMIT $%d OFFSET $%d`, argCount, argCount+1)
	args = append(args, limit, offset)

	rows, err := s.db.QueryContext(ctx, dataQuery, args...)
	if err != nil {
		log.Printf("Database error fetching reports data: %v", err)
		return nil, status.Error(codes.Internal, "Failed to fetch reports data")
	}
	defer func(rows *sql.Rows) {
		err := rows.Close()
		if err != nil {
			log.Printf("Database error closing rows: %v", err)
			return
		}
	}(rows)

	var reports []*pb.ReportSummary
	for rows.Next() {
		var r pb.ReportSummary
		var rawDate string
		var rawTime sql.NullString

		var accRate sql.NullFloat64
		var confRate sql.NullFloat64
		var analysisRes sql.NullString

		err := rows.Scan(
			&r.Id,
			&r.PatientName,
			&rawDate,
			&r.Status,
			&rawTime,
			&accRate,
			&confRate,
			&analysisRes,
		)

		if err != nil {
			log.Printf("Error scanning report row: %v", err)
			continue
		}

		r.Date = rawDate[:10]
		r.ReportType = "Full Analysis"
		r.Time = rawTime.String

		// FIXED: Safely assign pointers ONLY if the database value is NOT NULL
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

		// Because we used pointers, if the report is PENDING,
		// AccuracyRate, ConfidenceRate, and AnalysisResult will remain `nil`.
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
