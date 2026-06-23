import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0c0a09',
          backgroundImage: 'radial-gradient(circle at 25% 30%, rgba(220,38,38,0.22), transparent 45%)',
        }}
      >
        {/* Tyre ring mark */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: '50%',
            border: '10px solid #dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#1b1512',
              border: '4px solid #3a322c',
            }}
          />
        </div>

        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -1 }}>
          <span style={{ color: '#f3ede3' }}>Tyre</span>
          <span style={{ color: '#dc2626', marginLeft: 18, marginRight: 18 }}>on</span>
          <span style={{ color: '#f3ede3' }}>Cloud</span>
        </div>

        <div style={{ marginTop: 22, fontSize: 30, color: '#8fa3ad' }}>
          Premium Tyres · 40+ Global Brands · Nationwide Delivery in Thailand
        </div>
      </div>
    ),
    { ...size }
  );
}
