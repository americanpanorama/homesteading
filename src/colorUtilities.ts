export const hexToRgb = (hex: string) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) as RegExpExecArray;
  const rgb = result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : {
      r: 125,
      g: 125,
      b: 125,
    };
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
};

export const hextoRgba = (hex: string, opacity: number) => {
  const rgb = hexToRgb(hex);
  return `rgba(${rgb}, ${opacity})`;
};
