import { ImageResponse } from 'next/og';

const ALLOWED_SIZES = new Set(['192', '512']);

export async function GET(
  _request: Request,
  context: { params: Promise<{ size: string }> },
) {
  const { size } = await context.params;
  if (!ALLOWED_SIZES.has(size)) {
    return new Response('Not found', { status: 404 });
  }

  const dim = Number(size);
  const fontSize = dim * 0.28;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
          color: '#fafafa',
          fontSize,
          fontWeight: 700,
          letterSpacing: dim * -0.01,
        }}
      >
        NS
      </div>
    ),
    { width: dim, height: dim },
  );
}
