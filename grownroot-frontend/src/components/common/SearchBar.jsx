import { FiSearch } from 'react-icons/fi';

export default function SearchBar({ placeholder = 'Search...', value, onChange }) {
  return (
    <div className="flex items-center search-input px-4 py-2 w-full max-w-sm">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-transparent border-none outline-none text-dark-text text-sm flex-1 placeholder:text-dark-muted"
      />
      <FiSearch className="text-accent ml-2 shrink-0" />
    </div>
  );
}
