import { FC, useEffect, useState } from 'react';

import { ToggleGroup, ToggleGroupItem } from '@sashmen5/components';
import { useRouter } from '@tanstack/react-router';
import { Check } from 'lucide-react';

import { updateSerieStatus } from '../../entities/media-manager';

interface Props {
  id: number;
  orders: string[];
  defaultStatus: string;
  onStatusChange: () => void;
}

const ReportSerieStatus: FC<Props> = ({ onStatusChange, id, orders, defaultStatus }) => {
  console.log(defaultStatus);

  useEffect(() => {
    console.log('ReportMovieStatus mounted');
    return () => {
      console.log('ReportMovieStatus unmounted');
    };
  }, []);

  const route = useRouter();
  const [state, setState] = useState<string>(defaultStatus);
  const handleStatusChange = async (status: string) => {
    setState(status);
    await updateSerieStatus({ data: { status, id: id } });
    onStatusChange();
    route.invalidate();
  };

  console.log('[ReportMovieStatus render]', state);

  return (
    <ToggleGroup orientation={'vertical'} type={'single'} value={state} onValueChange={handleStatusChange}>
      {orders.map(status => (
        <ToggleGroupItem
          key={status}
          variant={'outline'}
          value={status}
          className={'group relative w-full items-center justify-start pl-8'}
        >
          <span className="invisible absolute left-2 flex h-3.5 w-3.5 items-center justify-center group-data-[state=on]:visible">
            <Check className="h-4 w-4" />
          </span>
          {status}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};

export { ReportSerieStatus };
