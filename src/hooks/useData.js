import { useState, useEffect } from 'react';
import { csv } from 'd3';

const useData = (url) => {
  const [data, setData] = useState();

  useEffect(() => {
    const row = (item) => ({
      ...item,
      Date: new Date(Date.parse(item.Date)),
    });

    csv(url, row).then(setData);
  }, [url]);

  return data;
};

export default useData;
