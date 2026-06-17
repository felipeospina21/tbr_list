import { INITIAL_BOOKS } from "@/components/migration/constants";
import { SearchSection } from "@/components/migration/SearchSection";

export default function SearchPage() {
	const books = INITIAL_BOOKS;
	return <SearchSection books={books} />;
}
