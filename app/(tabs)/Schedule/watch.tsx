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
import { Play } from "lucide-react-native";
import WebView from "react-native-webview";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import CategoryTabs from "@/components/CategoryTabs";
import DaySchedule from "@/components/DaySchedule";
import Sponsers from "@/components/Sponsers";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { baseUrl } from "@/config";

const WatchScreen = ({ navigation }: any) => {
	const params = useLocalSearchParams();

	const [eventData, setEventData] = useState({});
	const [loading, setLoading] = useState(true);

	const fetchEventDetails = async () => {		
		try {
			setLoading(true);
			const { data } = await axios.get(
				`${baseUrl}/event-management/details/${params?.id}`,
			);
			// console.log("===== res ====", data);
			
			setEventData(data);
		} catch (error) {
			console.log("Error fetching event details: ", error);
			return null;
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchEventDetails();
	}, []);

	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.bg }}
			contentContainerStyle={{ backgroundColor: theme.colors.bg }}
		>
			{/* Header */}
			<Header back />

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
				<>
					{/* Featured Image with Play Button */}
					<View
						style={{
							marginHorizontal: 20,
							marginTop: 20,
							backgroundColor: theme.colors.bg,
							borderRadius: 20,
							height: 200,
						}}
					>
						<YouTubePlayer
							url={eventData?.event_details?.youtube_video || "https://youtu.be/sRWcJrMTtMI?si=nS7o_2rGzBTGLuGg"}
							height={190}
							
						/>
						<View
							style={{
								alignItems: "flex-start",
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
								{eventData?.event_details?.eventname}
							</Text>
						</View>
					</View>

					{/* Category Tabs */}
					{eventData?.categories?.length > 0 && (
						<CategoryTabs data={{ categories: eventData?.categories, venue: eventData?.event_details?.venue }} />
					)}

					
				</>
			)}

			{/* Sponsors Section */}
			<Sponsers />
		</ScrollView>
	);
};

export default WatchScreen;
