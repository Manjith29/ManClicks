/**
 * Computes how many implicit grid rows (each `rowHeightPx` tall, separated
 * by `rowGapPx`) an image should span so its rendered aspect ratio is
 * preserved inside a CSS Grid masonry column of width `columnWidth`.
 */
export function computeRowSpan(
  width: number,
  height: number,
  columnWidth: number,
  rowHeightPx: number,
  rowGapPx: number
): number {
  const renderedHeight = (height / width) * columnWidth;
  const span = Math.ceil((renderedHeight + rowGapPx) / (rowHeightPx + rowGapPx));
  return Math.max(span, 1);
}
