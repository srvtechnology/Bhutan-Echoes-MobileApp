"use client";
import React, { useEffect, useState } from "react";
import {
	View,
	ScrollView,
	Text,
	TouchableOpacity,
	Image,
	FlatList,
	useWindowDimensions,
	ActivityIndicator,
} from "react-native";
import { useEventStore } from "../../../store/eventStore";
import { PlayCircle } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/theme/theme";
import Header from "@/components/header";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import axios from "axios";
import { baseUrl, mediaUrl } from "@/config";
import moment from "moment";
import Details from "@/components/Details";

const HomeScreen = ({ navigation }: any) => {
	const [eventData, setEventData] = useState({});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const initialize = async () => {
		// fetch events from API and set to state
		try {
			const { data } = await axios.get(
				`${baseUrl}/event-management/featured-event-list`,
			);
			const featuredEvents = data?.data || [];
			const currentDate = new Date();

			if (featuredEvents.length > 0) {
				const nearestDate = featuredEvents.reduce((prev: any, next: any) => {
					const prevDate = new Date(prev.start_date);
					const nextDate = new Date(next.start_date);

					const prevDiff = Math.abs(prevDate - currentDate);
					const nextDiff = Math.abs(nextDate - currentDate);

					return prevDiff < nextDiff ? prev : next;
				});
				await fetchEventDetails(nearestDate.id);
			}
		} catch (error) {
			console.log("Error fetching all events: ", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchEventDetails = async (eventId: string) => {
		const dummy = {
			event_details: {
				id: 4,
				eventname: "Event Sayan",
				eventdescription:
					"<div>Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development.</div>",
				start_date: "2026-03-12",
				end_date: "2026-03-14",
				start_time: "09:30:00",
				venue: "Barasat",
				youtube_video: null,
				icon: "event_management/1773208383_69b1033f525fb.jfif",
				banner_images: ["event_management/1773208383_69b1033f59ccf.jfif"],
				status: "active",
				is_featured: true,
				created_at: "2026-03-11T05:53:03.000000Z",
				updated_at: "2026-03-11T05:53:03.000000Z",
				categories: [
					{
						id: 2,
						name: "Workshops",
						slug: "workshops",
						status: "active",
						delete_status: "N",
						created_at: "2026-02-17T06:14:24.000000Z",
						updated_at: "2026-02-17T06:14:24.000000Z",
						pivot: {
							event_id: 4,
							category_id: 2,
						},
					},
					{
						id: 3,
						name: "Dialogue",
						slug: "dialogue",
						status: "active",
						delete_status: "N",
						created_at: "2026-02-17T06:14:35.000000Z",
						updated_at: "2026-02-17T06:14:35.000000Z",
						pivot: {
							event_id: 4,
							category_id: 3,
						},
					},
					{
						id: 4,
						name: "Conversation",
						slug: "conversation",
						status: "active",
						delete_status: "N",
						created_at: "2026-02-17T06:14:53.000000Z",
						updated_at: "2026-02-17T06:14:53.000000Z",
						pivot: {
							event_id: 4,
							category_id: 4,
						},
					},
				],
			},
			dates: [
				{
					day: "Day 1",
					date: "2026-03-12",
				},
			],
			guest_speaker: [
				{
					id: 8,
					speaker_name: "Sayan Ghosh",
					speaker_image: "speakers/1773208546_69b103e28b842.png",
					topic_name: "Lorem Ipsum Emit",
				},
				{
					id: 9,
					speaker_name: "Bijit Saha",
					speaker_image: "speakers/1773208596_69b10414a31c1.jpg",
					topic_name: "Workshop on building cars",
				},
			],
			categories: [
				{
					id: 2,
					name: "Workshops",
					slug: "workshops",
					status: "active",
					delete_status: "N",
					created_at: "2026-02-17T06:14:24.000000Z",
					updated_at: "2026-02-17T06:14:24.000000Z",
					pivot: {
						event_id: 4,
						category_id: 2,
					},
					dates: [
						{
							day: "Day 1",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [
								{
									id: 8,
									speaker_name: "Sayan Ghosh",
									topic_name: "Lorem Ipsum Emit",
									start_time: "10:30:00",
									formatted_time: "10:30 AM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208546_69b103e28b842.png",
								},
								{
									id: 9,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
							],
						},
					],
				},
				{
					id: 3,
					name: "Dialogue",
					slug: "dialogue",
					status: "active",
					delete_status: "N",
					created_at: "2026-02-17T06:14:35.000000Z",
					updated_at: "2026-02-17T06:14:35.000000Z",
					pivot: {
						event_id: 4,
						category_id: 3,
					},
					dates: [
						{
							day: "Day 1",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [
								{
									id: 8,
									speaker_name: "Sayan Ghosh",
									topic_name: "Lorem Ipsum Emit",
									start_time: "10:30:00",
									formatted_time: "10:30 AM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208546_69b103e28b842.png",
								},
								{
									id: 9,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
							],
						},
						{
							day: "Day 2",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [
								{
									id: 10,
									speaker_name: "Sayan Ghosh",
									topic_name: "Lorem Ipsum Emit 1",
									start_time: "10:30:00",
									formatted_time: "10:30 AM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208546_69b103e28b842.png",
								},
								{
									id: 11,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars 1",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
								{
									id: 12,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars 2",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
								{
									id: 13,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars 3",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
								{
									id: 14,
									speaker_name: "Bijit Saha",
									topic_name: "Workshop on building cars 4",
									start_time: "12:30:00",
									formatted_time: "12:30 PM",
									is_guest: true,
									speaker_image:
										"https://bhutanechos.srvtechnology.com/public/storage/speakers/1773208596_69b10414a31c1.jpg",
								},
							],
						},
						{
							day: "Day 3",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 4",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 5",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 6",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 7",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 8",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 9",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
						{
							day: "Day 10",
							date: "2026-03-12",
							category_id: 2,
							category_name: "Workshops",
							speakers: [],
						},
					],
				},
				{
					id: 4,
					name: "Conversation",
					slug: "conversation",
					status: "active",
					delete_status: "N",
					created_at: "2026-02-17T06:14:53.000000Z",
					updated_at: "2026-02-17T06:14:53.000000Z",
					pivot: {
						event_id: 4,
						category_id: 4,
					},
					dates: [],
				},
				// {
				//     "id": 5,
				//     "name": "Intermission",
				//     "slug": "intermission",
				//     "status": "active",
				//     "delete_status": "N",
				//     "created_at": "2026-02-17T06:14:53.000000Z",
				//     "updated_at": "2026-02-17T06:14:53.000000Z",
				//     "pivot": {
				//         "event_id": 4,
				//         "category_id": 4
				//     },
				//     "dates": []
				// },
				// {
				//     "id": 6,
				//     "name": "Test",
				//     "slug": "test",
				//     "status": "active",
				//     "delete_status": "N",
				//     "created_at": "2026-02-17T06:14:53.000000Z",
				//     "updated_at": "2026-02-17T06:14:53.000000Z",
				//     "pivot": {
				//         "event_id": 4,
				//         "category_id": 4
				//     },
				//     "dates": []
				// },
			],
			success: true,
		};
		try {
			const { data } = await axios.get(
				`${baseUrl}/event-management/details/${eventId}`,
			);
			// console.log("==== Event Details ====", data);
			setEventData(data || {});
		} catch (error) {
			console.log("Error fetching event details: ", error);
			return null;
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await initialize();
		setRefreshing(false);
	};

	useEffect(() => {
		initialize();
	}, []);

	const handleSpeakerNavigation = (data: any) => {
		router.push({
			pathname: "/(tabs)/home/eventDetails",
			params: data,
		});
	};

	const handleWatchNavigation = (data: any) => {
		router.push({
			pathname: "/(tabs)/home/watch",
			params: data,
		});
	};

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.bg }}
			contentContainerStyle={{ backgroundColor: theme.colors.bg }}
		>
			{/* Header */}
			<Header back={false} />

			{/* Loader */}
			{loading ? (
				<View
					style={{
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
						minHeight: 400,
					}}
				>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			) : (
				// Content - Only render when data is fully loaded
				<Details
					eventData={eventData}
					onWatchClick={handleWatchNavigation}
					handleSpeakerNavigation={handleSpeakerNavigation}
				/>
			)}
			{/* Sponsors Section */}
			<Sponsers />
		</ScrollView>
	);
};

export default HomeScreen;
