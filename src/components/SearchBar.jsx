export default function SearchBar({ search, setSearch }) {
  return (
    <input
      placeholder="Search articles..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
