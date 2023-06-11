import {useCallback, useState} from 'react';

type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

export function useRequest<IPayload = unknown>(
  {
    request,
    onResolve,
    onReject,
  }: {
    request: (payload: IPayload) => Promise<unknown>;
    onResolve?: (value: unknown) => void;
    onReject?: (error: unknown) => void;
  }) {
  const [status, setStatus] = useState<Status>('idle');
  const execute = useCallback(
    (payload: IPayload) => {
      setStatus('pending');
      request(payload)
        .then(data => {
          setStatus('resolved');
          onResolve?.(data);
        })
        .catch(error => {
          setStatus('rejected');
          onReject?.(error);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [request, onResolve, onReject]
  );

  return [execute, status] as const;
}
