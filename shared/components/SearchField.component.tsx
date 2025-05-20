import { ComponentRef, FC, useCallback, useRef, useState } from 'react';

import { useNavigate, useSearch } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { debounce, isEmpty } from 'shared/utils';

import { Input } from './Input.component';

interface Props {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  delay?: number;
}

const SearchField: FC<Props> = ({ value: valueProp = '', onChange, placeholder = 'Search', delay = 0 }) => {
  const searchRef = useRef<ComponentRef<'input'>>(null);
  const navigate = useNavigate();
  const params = useSearch({ strict: false });
  const [value, setValue] = useState(params.search ?? valueProp);

  const handleNavigate = (search?: string) => {
    navigate({
      to: '.',
      replace: true,
      search: prev => ({ ...prev, search: search, page: undefined }),
    });
  };

  const debounceNavigate = useCallback(
    debounce((search?: string) => {
      navigate({
        to: '.',
        replace: true,
        search: prev => ({ ...prev, search: search, page: undefined }),
      });
    }, delay),
    [navigate],
  );

  const handleOnChange = (val: string) => {
    setValue(val);

    if (onChange) {
      onChange(val);
      return;
    }

    const querySearch = isEmpty(val) ? undefined : val;
    if (!querySearch) {
      handleNavigate();
    } else {
      debounceNavigate(querySearch);
    }
  };

  return (
    <div className="relative grow">
      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={e => handleOnChange(e.target.value)}
        placeholder="Search"
        className="pl-8"
      />
    </div>
  );
};

export { SearchField };
