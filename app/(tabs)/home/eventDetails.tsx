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
} from "react-native";
import { useEventStore } from "../../../store/eventStore";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import { router, useLocalSearchParams } from "expo-router";
import moment from "moment";

interface DataProps {
	categories: any[];
	speaker: any;
	venue: string;
	category: string;
}

const HomeScreen = ({ navigation }: any) => {
	const {
		events,
		sponsors,
		setSelectedEvent,
		toggleSaveEvent,
		savedEvents,
		fetchEvents,
		fetchSponsors,
	} = useEventStore();
	const featuredEvent = events.find((e) => e.featured);
	const upcomingEvents = events;
	const { width } = useWindowDimensions();
	const isSaved = (eventId: string) => savedEvents.includes(eventId);

	const [data, setData] = useState<DataProps>();

	const params = useLocalSearchParams();

	const safeParse = (data: any) => {
		try {
			return JSON.parse(data);
		} catch {
			return null;
		}
	};

	useEffect(() => {
		const categories = safeParse(params.categories) || [];
		const venue = params.venue || "";
		const speaker = safeParse(params.speaker) || "";
		const category = params.category || "";

		setData({ categories, speaker, venue, category });
	}, []);

	const handleSpeakerNavigation = (data: any) => {
			router.push({
				pathname: "/(tabs)/home/eventDetails",
				params: data,
			});
		};
	

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.bg }}
			contentContainerStyle={{ backgroundColor: theme.colors.bg }}
		>
			{/* Header */}
			<Header back />

			{/* Featured Event */}
			{data && (
				<View
					style={{
						marginHorizontal: 16,
						marginTop: 16,
						elevation: 8,
						backgroundColor: "white",
						borderRadius: 24,
						shadowColor: theme.colors.gray400,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 4.65,
					}}
				>
					<View>
						<View
							style={{
								backgroundColor: theme.colors.back,
								borderRadius: 24,
								padding: 16,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<View style={{ width: "50%" }}>
									<Text
										style={{
											fontSize: 12,
											color: theme.colors.gray700,
											fontFamily: theme.typography.fontFamily.medium,
											paddingBottom: 4,
										}}
									>
										{data?.category}
									</Text>
									<Text
										style={{
											fontSize: 18,
											fontFamily: theme.typography.fontFamily.bold,
											color: theme.colors.text,
											lineHeight: 20,
										}}
									>
										{data?.speaker?.topic_name}
									</Text>
								</View>

								{/* Speaker */}
								<View
									style={{
										// overflow: "hidden",
										borderRadius: 60,
										alignItems: "center",
										width: "50%",
									}}
								>
									<Image
										source={{
											uri: data?.speaker?.speaker_image,
										}}
										style={{
											width: 120,
											height: 120,
											marginRight: 8,
											borderRadius: 60,
										}}
									/>
									<Text
										style={{
											fontSize: 15,
											color: theme.colors.gray600,
											fontFamily: theme.typography.fontFamily.regular,
											marginVertical: 8,
											lineHeight: 15,
										}}
									>
										{data?.speaker?.speaker_name}
									</Text>
								</View>
							</View>
							<View
								style={{
									height: 2,
									backgroundColor: theme.colors.gray300,
									marginVertical: 10,
								}}
							/>

							{/* Time and Location */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.gray500,
										fontFamily: theme.typography.fontFamily.medium,
									}}
								>
									{moment(data?.speaker?.start_time, "HH:mm").format("hh:mm A")}
								</Text>
								<Text
									style={{
										fontSize: 6,
										marginHorizontal: 6,
										color: theme.colors.gray500,
									}}
								>
									{`\u25CF`}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.gray500,
										fontFamily: theme.typography.fontFamily.medium,
									}}
								>
									{data?.venue}
								</Text>
							</View>
						</View>
					</View>
				</View>
			)}

			{/* Category Tabs */}
			{data?.categories?.length > 0 && (
				<CategoryTabs
					data={{ categories: data?.categories, venue: data?.venue }}
					handleSpeakerNavigation={handleSpeakerNavigation}
				/>
			)}

			{/* Sponsors Section */}
			<Sponsers />
		</ScrollView>
	);
};

export default HomeScreen;
