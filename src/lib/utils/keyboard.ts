export function isTypingTarget(target: EventTarget | null): boolean {
	return (
		target instanceof HTMLElement &&
		(target.tagName === 'INPUT' ||
			target.tagName === 'TEXTAREA' ||
			target.tagName === 'SELECT' ||
			target.isContentEditable)
	);
}

export function onShortcut(key: string, handler: (event: KeyboardEvent) => void): () => void {
	const listener = (event: KeyboardEvent) => {
		if (event.key !== key || event.metaKey || event.ctrlKey || event.altKey) return;
		handler(event);
	};
	window.addEventListener('keydown', listener);
	return () => window.removeEventListener('keydown', listener);
}
