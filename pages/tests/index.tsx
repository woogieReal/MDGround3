import React, { useState, useEffect } from "react";

const Home = () => {
  
  const [value, setValue] = useState<string>('');
  const [isAutoSaved, setIsAutoSaved] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    timeout = setTimeout(() => {
      setIsAutoSaved(true);
    }, 5000);
    if (value !== '') {
    }

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setIsAutoSaved(false);
        }}
      />
      {isAutoSaved && <p>It's been 5 seconds since the last change!</p>}
    </div>
  );
}

export default Home;
