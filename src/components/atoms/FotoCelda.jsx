import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';
import TableCell from '@mui/material/TableCell';

const FotoCelda = ({ photo, size = 40, alt = 'foto' }) => {
  const [loading, setLoading] = useState(true);

  if (!photo) {
    return <TableCell>Sin foto</TableCell>;
  }

  const src = photo;

  return (
    <TableCell align="center">
      <div style={{ width: size, height: size, position: 'relative' }}>
        {loading && (
          <Skeleton
            variant="rectangular"
            width={size}
            height={size}
            animation="wave"
            sx={{
              borderRadius: '20%',
              bgcolor: '#e0e0e0',
              '&::after': {
                animationDuration: '1s', // velocidad del efecto
              },
            }}
          />
        )}

        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{
            borderRadius: '20%',
            objectFit: 'cover',
            display: loading ? 'none' : 'block',
            transition: 'opacity 0.4s ease-in-out',
            opacity: loading ? 0 : 1,
          }}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
        />
      </div>
    </TableCell>
  );
};

export default FotoCelda;