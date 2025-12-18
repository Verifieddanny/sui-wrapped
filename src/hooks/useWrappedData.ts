import { useState, useEffect, useRef } from 'react';
import { checkWrappedStatusFn } from '@/functions/wrapped';

export function useWrappedData(address: string | null) {
  const [status, setStatus] = useState<'IDLE' | 'INDEXING' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [data, setData] = useState<any | null>(null);
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!address) return;

    const checkStatus = async () => {
      try {
        // Call the Server Function directly
        const res = await checkWrappedStatusFn({ data: address });

        if (res.status === 'COMPLETED' && res.data) {
          setData(res.data);
          setStatus('COMPLETED');
          if (pollInterval.current) clearInterval(pollInterval.current);
        } else if (res.status === 'INDEXING') {
          setStatus('INDEXING');
          if (!pollInterval.current) {
            pollInterval.current = setInterval(checkStatus, 3000);
          }
        }
      } catch (err) {
        console.error("Polling error", err);
        setStatus('ERROR');
        if (pollInterval.current) clearInterval(pollInterval.current);
      }
    };

    checkStatus();

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [address]);

  return { status, data };
}