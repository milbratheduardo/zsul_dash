import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ExternalRedirect = () => {
  const [link, setLink] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}link/tabela`);
        const data = await response.json();
        if (data.length > 0 && data[0].link) {
          setLink(data[0].link);
        } else {
          console.error("No link found in the response");
        }
      } catch (error) {
        console.error("Error fetching the link:", error);
      }
    };

    fetchLink();
  }, []);

  useEffect(() => {
    if (link) {
      window.open(link, '_blank');
      navigate(-1); 
    }
  }, [link, navigate]);

  return null;
};

export default ExternalRedirect;
