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
	Dimensions,
	ImageBackground,
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
import moment from "moment";
import Carousel from "react-native-reanimated-carousel";
import RenderHtml from "react-native-render-html";

const OtherEventDetails = ({ navigation }: any) => {
	const { events, setSelectedEvent, savedEvents, fetchEvents, fetchSponsors } =
		useEventStore();
	const { width } = useWindowDimensions();

	const [eventData, setEventData] = useState({});
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const params = useLocalSearchParams();
	const { width: SCREEN_WIDTH } = Dimensions.get("window");

	const initialize = async (eventId: string) => {
		try {
			const { data } = await axios.get(`${baseUrl}/other-events/${eventId}`);
			setEventData(data?.data || {});
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
				<>
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
						<Carousel
							width={SCREEN_WIDTH / 1.1}
							height={200}
							data={eventData?.banner_images || []}
							renderItem={({ item }: any) => (
								<ImageBackground
									resizeMode="cover"
									resizeMethod="auto"
									source={{ uri: item }}
									style={{
										height: 250,
										width: SCREEN_WIDTH / 1.1,
									}}
								></ImageBackground>
							)}
							loop
							autoPlay
							autoPlayInterval={4000}
							style={{ borderRadius: 17 }}
						/>
					</View>
					<View style={{ paddingHorizontal: 16, marginTop: 12 }}>
						<View
							style={{
								alignItems: "flex-start",
								marginBottom: 12,
							}}
						>
							<Text
								style={{
									fontSize: 16,
									fontFamily: theme.typography.fontFamily.semiBold,
									color: theme.colors.text,
									// flex: 1,
									lineHeight: 20,
								}}
							>
								{eventData?.eventname}
							</Text>
						</View>
						<RenderHtml
							systemFonts={[
								theme.typography.fontFamily.regular,
								theme.typography.fontFamily.medium,
								theme.typography.fontFamily.bold,
							]}
							contentWidth={SCREEN_WIDTH}
							source={{ html: eventData?.eventdescription }}
						/>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								paddingVertical: 20,
							}}
						>
							<Text
								style={{
									fontSize: 12,
									color: theme.colors.gray500,
									fontFamily: theme.typography.fontFamily.medium,
								}}
							>
								{moment(eventData?.start_date, "YYYY-MM-DD").format(
									"DD MMM YYYY",
								)}
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
								{moment(eventData?.start_time, "HH:mm:ss").format("hh:mm A")}
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
								{eventData?.venue}
							</Text>
						</View>
					</View>
				</>
			)}

			{/* Sponsors Section */}
			<Sponsers />
		</ScrollView>
	);
};

export default OtherEventDetails;
