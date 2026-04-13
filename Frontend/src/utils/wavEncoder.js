/**
 * Encode AudioBuffer to WAV format
 * @param {AudioBuffer} audioBuffer - The audio buffer to encode
 * @returns {Blob} The encoded WAV as a Blob
 */
export function encodeWAV(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  // We'll interleave channels if multiple exist, otherwise just use the first channel
  const result = interleaveChannels(audioBuffer);
  
  const length = result.length * (bitDepth / 8);
  const ab = new ArrayBuffer(44 + length);
  const view = new DataView(ab);
  
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 36 + length, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, length, true);
  
  const offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
  
  return new Blob([ab], { type: 'audio/wav' });
}

function interleaveChannels(audioBuffer) {
  const numChannels = audioBuffer.numberOfChannels;
  if (numChannels === 1) {
    return audioBuffer.getChannelData(0);
  }
  
  const channels = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(audioBuffer.getChannelData(i));
  }
  
  const length = channels[0].length * numChannels;
  const result = new Float32Array(length);
  
  let inputIndex = 0;
  for (let index = 0; inputIndex < channels[0].length; inputIndex++) {
    for (let channel = 0; channel < numChannels; channel++) {
      result[index++] = channels[channel][inputIndex];
    }
  }
  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
