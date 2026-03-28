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
import { router, useLocalSearchParams } from "expo-router";
import { theme } from "@/theme/theme";
import Header from "@/components/header";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import axios from "axios";
import { baseUrl } from "@/config";
import Details from "@/components/Details";

const HomeScreen = ({ navigation }: any) => {
	const { events, setSelectedEvent, savedEvents, fetchEvents, fetchSponsors } =
		useEventStore();
	const { width } = useWindowDimensions();

	const [eventData, setEventData] = useState({});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const params = useLocalSearchParams();

	const initialize = async (eventId: string) => {
		// fetch events from API and set to state
		try {
			const { data } = await axios.get(
				`${baseUrl}/event-management/details/${eventId}`,
			);
			console.log("==== Event Details ====", data);
			setEventData(data);
		} catch (error) {
			console.log("Error fetching all events: ", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const eventId = params?.id;
		if (eventId) initialize(eventId);
	}, []);

	const featuredEvent = events.find((e) => e.featured);

	const isSaved = (eventId: string) => savedEvents.includes(eventId);

  const handleSpeakerNavigation = (data: any) => {
      router.push({
        pathname: "/(tabs)/Schedule/eventDetails",
        params: data,
      });
    };
  
    const handleWatchNavigation = (data: any) => {
      router.push({
        pathname: "/(tabs)/Schedule/watch",
        params: data,
      });
    };

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.bg }}
			contentContainerStyle={{ backgroundColor: theme.colors.bg }}
		>
			{/* Header */}
			<Header back={true} />

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
				<Details eventData={eventData} onWatchClick={handleWatchNavigation}
					handleSpeakerNavigation={handleSpeakerNavigation} />
			)}

			{/* Sponsors Section */}
			<Sponsers />
		</ScrollView>
	);
};

export default HomeScreen;
