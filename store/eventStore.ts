import { create } from "zustand";

export interface Speaker {
	id: string;
	name: string;
	role: string;
	image: string;
}

export interface Event {
	id: string;
	title: string;
	description: string;
	category: "Talks" | "Workshops" | "Dialogue" | "Conversation";
	day: number;
	time: string;
	location: string;
	speakers: Speaker[];
	image: string;
	featured?: boolean;
	isSaved?: boolean;
}

export interface Sponsor {
	id: string;
	name: string;
	logo: string;
	category: string;
}

interface EventStore {
	events: Event[];
	sponsors: Sponsor[];
	selectedEvent: Event | null;
	savedEvents: string[];
	currentDay: number;
	selectedCategory: "Talks" | "Workshops" | "Dialogue" | "Conversation" | "All";

	// Actions
	setSelectedEvent: (event: Event | null) => void;
	toggleSaveEvent: (eventId: string) => void;
	setCurrentDay: (day: number) => void;
	setSelectedCategory: (
		category: "Talks" | "Workshops" | "Dialogue" | "Conversation" | "All",
	) => void;
	getFilteredEvents: () => Event[];
	fetchEvents: () => Promise<void>;
	fetchSponsors: () => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
	events: [],
	sponsors: [],
	selectedEvent: null,
	savedEvents: [],
	currentDay: 1,
	selectedCategory: "All",

	setSelectedEvent: (event) => set({ selectedEvent: event }),

	toggleSaveEvent: (eventId) => {
		set((state) => {
			const isSaved = state.savedEvents.includes(eventId);
			return {
				savedEvents: isSaved
					? state.savedEvents.filter((id) => id !== eventId)
					: [...state.savedEvents, eventId],
			};
		});
	},

	setCurrentDay: (day) => set({ currentDay: day }),

	setSelectedCategory: (category) => set({ selectedCategory: category }),

	getFilteredEvents: () => {
		const state = get();
		let filtered = state.events.filter(
			(event) => event.day === state.currentDay,
		);

		if (state.selectedCategory !== "All") {
			filtered = filtered.filter(
				(event) => event.category === state.selectedCategory,
			);
		}

		return filtered;
	},

	fetchEvents: async () => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));

		const dummyEvents: Event[] = [
			{
				id: "1",
				title: "The Wisdom of Balance: The Great Fourth's Legacy",
				description:
					"Exploring the profound wisdom and teachings of the Fourth King of Bhutan.",
				category: "Talks",
				day: 1,
				time: "9:30AM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s1",
						name: "T. Matthue",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
					},
					{
						id: "s2",
						name: "Tshering T",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
					},
					{
						id: "s3",
						name: "M. Silva",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=400&fit=crop",
					},
					{
						id: "s4",
						name: "A. Carlos",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
				featured: true,
			},
			{
				id: "2",
				title: "Footsteps of Compassion: A Queen's Legacy",
				description:
					"Understanding the compassionate leadership that shaped a nation.",
				category: "Dialogue",
				day: 2,
				time: "10:30AM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s5",
						name: "Priya Kapoor",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
					},
					{
						id: "s6",
						name: "Chimi P. Wangdi",
						role: "Speaker",
						image:
							"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
			},
			{
				id: "3",
				title: "Green Initiatives: Building a Sustainable Future",
				description:
					"Workshop on sustainable practices and environmental conservation.",
				category: "Workshops",
				day: 1,
				time: "10:30AM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s7",
						name: "Dr. Thapa",
						role: "Facilitator",
						image:
							"https://images.unsplash.com/photo-1516321318423-f06f70504646?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=400&fit=crop",
			},
			{
				id: "4",
				title: "The Gentle Art of Storytelling",
				description:
					"Mastering the craft of compelling narratives across cultures.",
				category: "Talks",
				day: 2,
				time: "11:00AM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s8",
						name: "Karma Wangdi",
						role: "Author",
						image:
							"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
			},
			{
				id: "5",
				title: "Reviving Traditional Arts",
				description:
					"Preserving cultural heritage through traditional artistic practices.",
				category: "Workshops",
				day: 3,
				time: "1:00PM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s9",
						name: "Sonam Dorji",
						role: "Master Craftsperson",
						image:
							"https://images.unsplash.com/photo-1519085360771-9852046c9c30?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=400&fit=crop",
			},
			{
				id: "6",
				title: "Digital Transformation in Arts",
				description:
					"How technology is reshaping cultural expression and preservation.",
				category: "Conversation",
				day: 2,
				time: "3:00PM",
				location: "RUB Hall",
				speakers: [
					{
						id: "s10",
						name: "Tech Kumar",
						role: "Digital Expert",
						image:
							"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
					},
					{
						id: "s11",
						name: "Art Devi",
						role: "Cultural Curator",
						image:
							"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
					},
				],
				image:
					"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
			},
		];

		set({ events: dummyEvents });
	},

	fetchSponsors: async () => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 300));

		const dummySponsors: Sponsor[] = [
			{
				id: "sp1",
				name: "Bhutan Arts Foundation",
				logo: "🏛️",
				category: "Gold",
			},
			{
				id: "sp2",
				name: "Cultural Heritage Fund",
				logo: "🎭",
				category: "Silver",
			},
			{
				id: "sp3",
				name: "Global Arts Initiative",
				logo: "🌍",
				category: "Silver",
			},
			{
				id: "sp4",
				name: "Global Arts Initiative",
				logo: "🌍",
				category: "Silver",
			},
			{
				id: "sp5",
				name: "Global Arts Initiative",
				logo: "🌍",
				category: "Silver",
			},
		];

		set({ sponsors: dummySponsors });
	},
}));
