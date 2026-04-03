import {
	View,
	Text,
	TouchableOpacity,
	FlatList,
	Image,
	ActivityIndicator,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import { PlayCircle } from "lucide-react-native";
import { baseUrl, mediaUrl } from "@/config";
import axios from "axios";
import moment from "moment";
import EventCards from "@/components/EventCards";

export default function Schedule() {
	// const events = [
	// 	{
	// 		id: "1",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: false,
	// 	},
	// 	{
	// 		id: "2",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: true,
	// 	},
	// 	{
	// 		id: "3",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: false,
	// 	},
	// 	{
	// 		id: "4",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: false,
	// 	},
	// 	{
	// 		id: "5",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: true,
	// 	},
	// 	{
	// 		id: "6",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: false,
	// 	},
	// 	{
	// 		id: "7",
	// 		title: "The Wisdom of Balance: The Great Fourth's Legacy",
	// 		status: "Happening Now",
	// 		isFeatured: false,
	// 	},
	// ];
	const [events, setEvents] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const initialize = async () => {
		// fetch events from API and set to state
		try {
			const { data } = await axios.get(
				`${baseUrl}/event-management/fetch-event-list`,
			);
			setEvents(data?.data || []);
		} catch (error) {
			console.log("Error fetching all events: ", error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await initialize();
		setRefreshing(false);
	};

	useEffect(() => {
		setLoading(true);
		initialize();
	}, []);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
			<Header back={false} />
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontSize: 14,
						fontFamily: theme.typography.fontFamily.medium,
						color: theme.colors.primary,
						marginVertical: 10,
						paddingHorizontal: 16,
					}}
				>
					My Events
				</Text>
				{loading ? (
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<ActivityIndicator size="large" color={theme.colors.primary} />
					</View>
				) : (
					<FlatList
						style={{ backgroundColor: theme.colors.bg, paddingHorizontal: 16 }}
						data={events}
						keyExtractor={(e) => e.id}
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
						renderItem={({ item }) => (
							<EventCards
								item={item}
								handleCardPress={() =>
									router.push({
										pathname: "/Schedule/details",
										params: { id: item.id },
									})
								}
							/>
						)}
					/>
				)}
			</View>
		</View>
	);
}
