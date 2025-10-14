import { useEffect } from 'react';

const EditPersonal = ({ id_personal }) => {
  useEffect(() => {
    if (id_personal) {
      const url = `https://walisanga.space/credenciales-2025/${id_personal}`;
      window.open(
        url,
        'EditarPersonal',
        'width=1000,height=700,scrollbars=yes,resizable=yes'
      );
    }
  }, [id_personal]);

  return null; 
};

export default EditPersonal;

