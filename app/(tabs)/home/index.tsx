"use client";
import React, { useEffect } from "react";
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
import {PlayCircle} from "lucide-react-native"
import { router } from "expo-router";


const HomeScreen = ({ navigation }: any) => {
  const theme = {
    colors: {
	// Primary colors
	primary: "#33B564", // Vibrant Green (Bhutan Echoes theme)
	secondary: "#86EFAC", // Light Green
	tertiary: "#16A34A", // Dark Green

	// Neutrals - Cream and off-white theme
	white: "#FAFAF8",
	cream: "#F5F5F3",
	gray50: "#F9F8F6",
	gray100: "#EFE9E6",
	gray200: "#E6DDD8",
	gray300: "#D4C8C0",
	gray400: "#B8A8A0",
	gray500: "#8F8F8F",
	gray600: "#6B6B6B",
	gray700: "#4D4D4D",
	gray800: "#2D2D2D",
	gray900: "#1A1A1A",
	black: "#000000",

	// Feedback colors
	success: "#22C55E", // Green
	warning: "#F59E0B", // Amber
	error: "#EF4444", // Red
	info: "#3B82F6", // Blue
}
  }
	const { events, sponsors, setSelectedEvent, toggleSaveEvent, savedEvents, fetchEvents,
    fetchSponsors, } =
		useEventStore();
	const { width } = useWindowDimensions();

  useEffect(() => {
    fetchEvents();
    fetchSponsors();
  }, []);

  

	const featuredEvent = events.find((e) => e.featured);
	const upcomingEvents = events;

	const handleEventPress = (event: any) => {
		setSelectedEvent(event);
		router.push("/(tabs)/home/eventDetails");
	};

	const isSaved = (eventId: string) => savedEvents.includes(eventId);

	return (
		<ScrollView style={[{ flex: 1, backgroundColor: theme.colors.background }]}>
			{/* Header */}
			<View
				style={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 10 }}
			>
				<View
					style={{
						flexDirection: "column",
						justifyContent: "space-between",
						// alignItems: "center",
					}}
				>
					<TouchableOpacity
						style={{
							backgroundColor: "#33b564",
							paddingHorizontal: 24,
							paddingVertical: 8,
							borderRadius: 10,
							alignSelf: "flex-end",
						}}
					>
						<Text style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
							DONATE
						</Text>
					</TouchableOpacity>
					<View style={{ paddingLeft: 10, paddingTop: 10 }}>
						<Text
							style={{
								fontSize: 28,
								fontWeight: "700",
								color: theme.colors.text,
								marginBottom: 4,
							}}
						>
							2026{" "}
							<Text style={{ color: theme.colors.text, fontWeight: "500" }}>
								| Bhutan Echoes
							</Text>
						</Text>

						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text
								style={{
									fontSize: 12,
									color: theme.colors.gray600,
									marginTop: 2,
									fontWeight: "bold",
								}}
							>
								15 Years
							</Text>
							<Text
								style={{
									fontSize: 6,
									marginHorizontal: 6,
								}}
							>
								{`\u25CF`}
							</Text>
							<Text
								style={{
									fontSize: 12,
									color: theme.colors.gray600,
									marginTop: 2,
									fontWeight: "bold",
								}}
							>
								Drukyul's Literature and Arts Festival
							</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Featured Event */}
			{featuredEvent && (
				<View
					style={{
						marginHorizontal: 16,
						marginTop: 16,
						marginBottom: 20,
						elevation: 8,
						backgroundColor: "white",
						borderRadius: 24,
						shadowColor: theme.colors.gray400,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 4.65,
					}}
				>
					<TouchableOpacity onPress={() => handleEventPress(featuredEvent)}>
						<View
							style={{
								backgroundColor: "#e7eedf",
								borderRadius: 24,
								padding: 16,
							}}
						>
							<Text
								style={{
									fontSize: 12,
									color: "#33B564",
									fontWeight: "600",
									paddingBottom: 8,
								}}
							>
								Happening Now
							</Text>
							<View
								style={{
									// flexDirection: "row",
									// justifyContent: "space-between",
									alignItems: "flex-start",
									marginBottom: 12,
								}}
							>
								<Text
									style={{
										fontSize: 18,
										fontWeight: "bold",
										color: theme.colors.text,
										flex: 1,
									}}
								>
									The Wisdom of Balance:
								</Text>
								<Text
									style={{
										fontSize: 18,
										fontWeight: "bold",
										color: theme.colors.text,
										flex: 1,
									}}
								>
									The Great Fourth's Legacy
								</Text>
								{/* <TouchableOpacity
									onPress={() => toggleSaveEvent(featuredEvent.id)}
									style={{ marginLeft: 8 }}
								>
									<Heart
										width={20}
										height={20}
										color={
											isSaved(featuredEvent.id) ? theme.colors.primary : "#999"
										}
										fill={
											isSaved(featuredEvent.id) ? theme.colors.primary : "none"
										}
									/>
								</TouchableOpacity> */}
							</View>

							{/* Speakers */}
							<View style={{ marginBottom: 12 }}>
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
										gap: 8,
									}}
								>
									{featuredEvent.speakers.map((speaker: any) => (
										<TouchableOpacity
											key={speaker.id}
											style={{
												backgroundColor: theme.colors.primary,
												borderRadius: 12,
												paddingHorizontal: 12,
												paddingVertical: 6,
												flexDirection: "row",
												alignItems: "center",
												width: 110,
											}}
										>
											<Image
												source={{
													uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
												}}
												style={{
													width: 28,
													height: 28,
													marginRight: 8,
												}}
											/>
											<Text
												style={{
													color: "white",
													fontSize: 12,
													fontWeight: "600",
												}}
											>
												{speaker.name}
											</Text>
										</TouchableOpacity>
									))}
								</View>
							</View>
							<View
								style={{
									height: 2,
									backgroundColor: theme.colors.gray400,
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
										color: theme.colors.gray700,
										fontWeight: "bold",
									}}
								>
									{featuredEvent.time}
								</Text>
								<Text
									style={{
										fontSize: 6,
										marginHorizontal: 6,
									}}
								>
									{`\u25CF`}
								</Text>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.gray700,
										fontWeight: "bold",
									}}
								>
									{featuredEvent.location}
								</Text>
								<TouchableOpacity
									style={{
										flexDirection: "row",
										alignItems: "center",
										marginLeft: 10,
									}}
									onPress={() => router.push("/(tabs)/home/watch")}
								>
									<PlayCircle width={20} height={20} color={"red"} />
									<Text
										style={{
											color: theme.colors.gray700,
											marginLeft: 4,
											fontWeight: "bold",
										}}
									>
										Watch
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</TouchableOpacity>
				</View>
			)}

			{/* Category Tabs */}
			<View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
				<ScrollView horizontal showsHorizontalScrollIndicator={false}>
					{["Talks", "Workshops", "Dialogue", "Conversation"].map(
						(category) => (
							<TouchableOpacity
								key={category}
								style={{
									marginRight: 8,
									paddingHorizontal: 12,
									paddingVertical: 6,
									// borderRadius: 6,
									// backgroundColor: theme.colors.gray100,
									borderRightWidth: 1,
									borderRightColor: theme.colors.gray300,
								}}
							>
								<Text
									style={{
										fontSize: 14,
										color: theme.colors.text,
										fontWeight: "600",
									}}
								>
									{category}
								</Text>
							</TouchableOpacity>
						),
					)}
				</ScrollView>
			</View>

			{/* Day Schedule */}
			<View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
				{/* <Text
					style={{
						fontSize: 14,
						fontWeight: "700",
						color: theme.colors.text,
						marginBottom: 12,
					}}
				>
					Schedule by Day
				</Text> */}
				<View
					style={{
						flexDirection: "row",
						marginBottom: 12,
						borderRadius: 20,
						overflow: "hidden",
					}}
				>
					{[1, 2, 3, 4].map((day) => (
						<TouchableOpacity
							key={day}
							style={{
								paddingHorizontal: 12,
								paddingVertical: 8,
								backgroundColor: day === 1 ? theme.colors.primary : "#e7eedf",
								flex: 1,
								alignItems: "center",
							}}
						>
							<Text
								style={{
									fontSize: 12,
									fontWeight: "600",
									color: day === 1 ? "white" : theme.colors.text,
								}}
							>
								Day {day}
							</Text>
						</TouchableOpacity>
					))}
				</View>

				{/* Event Cards */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{
						width: "94%",
						alignSelf: "center",
					}}
				>
					{upcomingEvents.map((event) => (
						<TouchableOpacity
							key={event.id}
							onPress={() => handleEventPress(event)}
							style={{
								// width: width * 0.35,
								alignItems: "center",
							}}
						>
							<Image
								source={{
									uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
								}}
								style={{
									width: 70,
									height: 70,
									borderRadius: 40,
									marginBottom: 8,
									backgroundColor: "#33b564",
								}}
							/>
							<Text
								style={{
									fontSize: 13,
									color: theme.colors.text,
									textAlign: "center",
									fontWeight: "bold",
									height: 30,
									width: 80,
								}}
								numberOfLines={2}
							>
								{event.title.split(":")[0]}
							</Text>
							<View
								style={{
									height: 2,
									backgroundColor: theme.colors.gray400,
									width: "100%",
									marginVertical: 6,
									marginTop: 20,
								}}
							/>
							<Text
								style={{
									fontSize: 10,
									color: theme.colors.gray600,
									marginTop: 4,
								}}
							>
								{event.time}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Sponsors Section */}
			<View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
				<Text
					style={{
						fontSize: 14,
						fontWeight: "700",
						color: theme.colors.primary,
						// marginBottom: 12,
					}}
				>
					Our Sponsors
				</Text>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
						// paddingVertical: 12,
					}}
				>
					<ScrollView horizontal showsHorizontalScrollIndicator={false}>
						{sponsors.map((sponsor) => (
							<View
								key={sponsor.id}
								style={{
									marginRight: 6,
								}}
							>
								<Image
									source={{
										uri: "data:image/jpeg;base64,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",
									}}
									resizeMode="contain"
									style={{
										width: 100,
										height: 100,
									}}
								/>
							</View>
						))}
					</ScrollView>
				</View>
			</View>
		</ScrollView>
	);
};

export default HomeScreen;
