import { PanelFilterConfig } from '../types/comic';

export function applyFiltersToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: PanelFilterConfig
) {
  // If brightness / contrast / saturation / sepia are set via CSS filters
  const cssFilters: string[] = [];
  if (filter.brightness !== 0) cssFilters.push(`brightness(${100 + filter.brightness}%)`);
  if (filter.contrast !== 0) cssFilters.push(`contrast(${100 + filter.contrast}%)`);
  if (filter.saturation !== 0) cssFilters.push(`saturate(${100 + filter.saturation}%)`);
  if (filter.sepia > 0) cssFilters.push(`sepia(${filter.sepia}%)`);

  if (cssFilters.length > 0) {
    ctx.filter = cssFilters.join(' ');
  }

  // Pixel-level manipulations for Halftone & Noir Threshold
  if (filter.noirThreshold > 0 || filter.halftone) {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Noir Threshold
    if (filter.noirThreshold > 0) {
      const thresh = filter.noirThreshold;
      for (let i = 0; i < data.length; i += 4) {
        // Luminance calculation
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        const val = lum >= thresh ? 255 : 0;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    // Manga Screentone / Halftone
    if (filter.halftone) {
      const dotSize = Math.max(2, filter.halftoneDotSize || 4);
      // Create offscreen buffer
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.drawImage(ctx.canvas, 0, 0, width, height);
        const sourceData = tempCtx.getImageData(0, 0, width, height).data;

        // Clear canvas with white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#000000';

        for (let y = 0; y < height; y += dotSize) {
          for (let x = 0; x < width; x += dotSize) {
            const idx = (y * width + x) * 4;
            const r = sourceData[idx] ?? 255;
            const g = sourceData[idx + 1] ?? 255;
            const b = sourceData[idx + 2] ?? 255;
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // Invert: darker means larger dot
            const radius = (1 - brightness) * (dotSize / 1.4);
            if (radius > 0.4) {
              ctx.beginPath();
              ctx.arc(x + dotSize / 2, y + dotSize / 2, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }
    }
  }

  // Draw Action Speed Lines
  if (filter.speedLines) {
    drawSpeedLines(
      ctx,
      width,
      height,
      (filter.speedLinesCenterX / 100) * width,
      (filter.speedLinesCenterY / 100) * height,
      filter.speedLinesDensity || 45
    );
  }
}

export function drawSpeedLines(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  count: number = 40
) {
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';

  const maxRadius = Math.hypot(Math.max(centerX, width - centerX), Math.max(centerY, height - centerY));
  const innerRadius = maxRadius * 0.35; // safe center bubble

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.05;
    const startDistance = innerRadius + Math.random() * (innerRadius * 0.4);
    const endDistance = maxRadius + 20;

    const x1 = centerX + Math.cos(angle) * startDistance;
    const y1 = centerY + Math.sin(angle) * startDistance;
    const x2 = centerX + Math.cos(angle) * endDistance;
    const y2 = centerY + Math.sin(angle) * endDistance;

    const wedgeWidth = 2 + Math.random() * 4;
    const orthoAngle = angle + Math.PI / 2;
    const wx = Math.cos(orthoAngle) * (wedgeWidth / 2);
    const wy = Math.sin(orthoAngle) * (wedgeWidth / 2);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2 + wx, y2 + wy);
    ctx.lineTo(x2 - wx, y2 - wy);
    ctx.closePath();
    ctx.globalAlpha = 0.55 + Math.random() * 0.35;
    ctx.fill();
  }

  ctx.restore();
}

export function downloadCanvasAsImage(canvas: HTMLCanvasElement, filename: string = 'comic-page.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png', 0.95);
  link.click();
}
