'use client';
import { type Message } from '@/db/schema';
import { cn, getInitials } from '@/lib/utils';
import React from 'react';
import md from 'markdown-it';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import { ChatContextMessage } from '@/types/types';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const formatTimestamp = (timestamp: Date) => {
	// date time format
	return format(timestamp, 'h:mm a');
};

const formatSectionDiffDate = (date: Date) => {
	// if today or yesterday, use formatDistance
	// else use MMMM d, yyyy
	if (subDays(new Date(), 1) < date) {
		return formatDistanceToNow(date, {
			addSuffix: true,
		});
	}
	return format(date, 'MMMM d, yyyy', {});
};
interface MessageProps {
	message: ChatContextMessage;
	chatPartnersMap: Map<string, User>;
	user: User;
	hasNextMessageFromSameUser: boolean;
	isDateDifferent: boolean;
}
const Message = React.forwardRef<HTMLDivElement, MessageProps>(
	(
		{
			message,
			chatPartnersMap,
			user,
			hasNextMessageFromSameUser,
			isDateDifferent,
		},
		ref
	) => {
		const isCurrentUser = message.sender === user.id;
		const partner = !isCurrentUser
			? chatPartnersMap.get(message.sender)
			: undefined;
		/// decrypt message and render markdown
		return (
			<div
				ref={ref}
				className="max-w-full"
				key={`${message.id}-${message.updatedAt}`}
			>
				{isDateDifferent && (
					<div className="text-center flex items-center gap-2 text-muted-foreground mb-1.5">
						<span className="border-t border-gray-100 flex-1" />
						<span className="px-2 py-0.5 bg-gray-200/30 border border-gray-200 backdrop-blur-xl rounded-full text-[0.55rem] ">
							{formatSectionDiffDate(message.createdAt)}
						</span>
						<span className="border-t border-gray-100 flex-1" />
					</div>
				)}
				<div
					className={cn('flex items-end', {
						'justify-end': isCurrentUser,
					})}
				>
					<div
						className={cn('flex flex-col space-y-0.5 text-base max-w-xs mx-2', {
							'order-1 items-end': isCurrentUser,
							'order-2 items-start': !isCurrentUser,
						})}
					>
						<span
							className={cn('px-4 py-2 rounded-lg inline-block', {
								'bg-indigo-600': isCurrentUser,
								'bg-gray-200': !isCurrentUser,
								'rounded-br-none': !hasNextMessageFromSameUser && isCurrentUser,
								'rounded-bl-none':
									!hasNextMessageFromSameUser && !isCurrentUser,
							})}
						>
							<p
								className={cn(
									'p-0 m-0 whitespace-wrap max-w-full text-white prose',
									{
										'text-white prose-a:text-blue-200 hover:prose-a:text-blue-400 prose-headings:text-white':
											isCurrentUser,
										'text-gray-800 prose-a:text-blue-600 hover:prose-a:text-blue-800 prose-headings:text-gray-900':
											!isCurrentUser,
									}
								)}
								dangerouslySetInnerHTML={{
									__html: md().render(message.text),
								}}
							></p>
						</span>
						<div className="flex items-center gap-1.5 text-muted-foreground">
							<span className="block leading-tight text-[0.6rem]">
								{formatTimestamp(message.updatedAt)}
							</span>
							{message?.isLoading ? (
								<Check className="w-3.5 h-3.5" />
							) : (
								<CheckCheck className="w-3.5 h-3.5" />
							)}
						</div>
					</div>
					<Avatar asChild>
						<div
							className={cn('relative w-8 h-8 mb-4', {
								'order-2': isCurrentUser,
								'order-1': !isCurrentUser,
								invisible: hasNextMessageFromSameUser,
							})}
						>
							<AvatarImage
								src={isCurrentUser ? user.image || '' : partner?.image || ''}
								referrerPolicy="no-referrer"
								alt="profile picture"
								width={32}
								height={32}
							/>
							<AvatarFallback>
								{getInitials(
									isCurrentUser ? user.name || '' : partner?.name || ''
								)}
							</AvatarFallback>
						</div>
					</Avatar>
				</div>
			</div>
		);
	}
);

Message.displayName = 'Message';

export default Message;
