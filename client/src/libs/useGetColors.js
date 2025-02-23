
import { useEffect, useState } from "react";

function useGetColors() {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://www.csscolorsapi.com/api/colors");
        const data = await response.json();
        if (data?.colors) setColors(data?.colors);
        else console.log(data);
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };

    fetchData();
  }, []);

  return colors;
}

export default useGetColors;
