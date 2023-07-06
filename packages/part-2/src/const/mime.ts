export const MIME_PNG = 'image/png';
export const MIME_JPEG = 'image/jpeg';

export const fileExtension = (mime: string, preDot?: boolean) => {
  switch (mime) {
    case MIME_JPEG:
      return `${preDot && '.'}jpg`;
    case MIME_PNG:
      return `${preDot && '.'}png`;
  }

  return '';
};
