import { Request, Response } from 'express';

type GetImageRequest = Request & {
  query: {
    imageUrl: string
  }
}

export const getImage = async (req: GetImageRequest, res: Response) => {
  try {
    _validateRequest(req);

    const { imageUrl } = req.query;
    const image = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'image/jpeg'
      }
    });

    const blob = await image.blob();

    const buffer = await blob.arrayBuffer();
    const bufferArray = new Uint8Array(buffer);
    const imageBuffer = Buffer.from(bufferArray);
    res.writeHead(200, { 'Content-Type': 'image/jpeg', 'Content-Length': imageBuffer.length });
    res.end(imageBuffer);

  } catch (error: any) {
    const status = error.status || 500;
    const errorMessage = error.message || 'Internal server error';
    res.status(status).json({ error: errorMessage });
  }
}

const _validateRequest = (req: Request) => {
  const { imageUrl } = req.query;
  if (!imageUrl) {
    throw { status: 400, message: 'Missing imageUrl' };
  }
}