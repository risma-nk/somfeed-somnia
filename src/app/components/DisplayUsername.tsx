import { useEffect, useState } from 'react';
import { getUsername } from '../../lib/getUsername';

interface DisplayUsernameProps {
  address: `0x${string}`;
}

const DisplayUsername = ({ address }: DisplayUsernameProps) => {
  const [username, setUsername] = useState<string | null>(null);
  const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  useEffect(() => {
    let isMounted = true; 

    const fetchUsername = async () => {
      const name = await getUsername(address);
      if (isMounted) {
        setUsername(name);
      }
    };

    fetchUsername();
    return () => {
      isMounted = false;
    };
  }, [address]);
  return (
    <span className="font-bold text-white hover:underline">
      {username ? username : shortAddress}
    </span>
  );
};

export default DisplayUsername;