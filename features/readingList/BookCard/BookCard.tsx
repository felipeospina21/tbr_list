import { StickyNote, UserRoundPen } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Badge } from "@/components/Badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/Card";
import type { Book } from "../readingList";

type BookCardProps = {
	book: Book;
	topBadge: ReactNode;
	footer: ReactNode;
	priority?: boolean;
	titleClassName?: string;
	descriptionClassName?: string;
	imageSizes?: string;
	imageAltSuffix?: string;
};

export function BookCard({
	book,
	topBadge,
	footer,
	priority = false,
	titleClassName = "text-2xl",
	descriptionClassName = "text-sm leading-6 text-stone-700 sm:text-[15px]",
	imageSizes = "(max-width: 768px) 100vw, 190px",
	imageAltSuffix = "cover",
}: BookCardProps) {
	return (
		<Card className="overflow-hidden">
			<div className="grid gap-0 md:grid-cols-[190px_minmax(0,1fr)]">
				<div className={`bg-gradient-to-br ${book.accent} p-4 sm:p-5`}>
					<div className="relative mx-auto aspect-[3/4] w-full max-w-[220px] overflow-hidden rounded-[1.25rem] shadow-lg ring-1 ring-white/50">
						<Image
							src={book.cover}
							alt={`${book.title} ${imageAltSuffix}`}
							fill
							className="object-cover"
							sizes={imageSizes}
							unoptimized
							priority={priority}
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<CardHeader className="gap-3">
						<div className="flex flex-col items-start justify-between gap-3">
							<div className="flex justify-between w-full space-y-2">
								{topBadge}
								<Badge className="bg-stone-950 px-3 text-white">
									<StickyNote className="mr-1.5 size-3" />
									{typeof book.pages === "number" ? `${book.pages}` : "n/a"}
								</Badge>
							</div>
							<CardTitle className={titleClassName}>{book.title}</CardTitle>
							<span className="w-full flex items-center">
								<UserRoundPen className="mr-1.5 size-3 italic" />
								<p className="text-sm text-stone-600 italic">{book.author}</p>
							</span>
						</div>
					</CardHeader>

					<CardContent className="pt-0">
						<CardDescription
							className={`book-description-clamp ${descriptionClassName}`}
						>
							{book.description}
						</CardDescription>
					</CardContent>

					<CardFooter>{footer}</CardFooter>
				</div>
			</div>
		</Card>
	);
}
