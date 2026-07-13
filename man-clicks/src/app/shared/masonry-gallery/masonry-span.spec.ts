import { computeRowSpan } from './masonry-span';

describe('computeRowSpan', () => {
  it('computes a larger span for a taller image at the same column width', () => {
    // Square image at 300px column width => rendered height ~300px.
    const squareSpan = computeRowSpan(900, 900, 300, 8, 16);
    // Portrait image (taller) at the same column width => rendered height ~375px.
    const portraitSpan = computeRowSpan(800, 1000, 300, 8, 16);
    expect(portraitSpan).toBeGreaterThan(squareSpan);
  });

  it('computes a smaller span for a shorter (landscape) image', () => {
    const landscapeSpan = computeRowSpan(1000, 750, 300, 8, 16);
    const squareSpan = computeRowSpan(900, 900, 300, 8, 16);
    expect(landscapeSpan).toBeLessThan(squareSpan);
  });

  it('always returns a positive integer span', () => {
    const span = computeRowSpan(1000, 700, 300, 8, 16);
    expect(Number.isInteger(span)).toBeTrue();
    expect(span).toBeGreaterThan(0);
  });
});
