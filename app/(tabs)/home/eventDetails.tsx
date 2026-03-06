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
		navigation.navigate("EventDetail");
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
											color: theme.colors.gray800,
											fontWeight: "600",
											paddingBottom: 8,
										}}
									>
										Dialogue
									</Text>
									<Text
										style={{
											fontSize: 18,
											fontWeight: "bold",
											color: theme.colors.text,
										}}
									>
										The Wisdom of Balance:
									</Text>
									<Text
										style={{
											fontSize: 18,
											fontWeight: "bold",
											color: theme.colors.text,
										}}
									>
										The Great Fourth's Legacy
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
											uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
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
											fontWeight: "600",
											marginTop: 8,
											// textAlign: "center",
										}}
									>
										Priya Kapoor
									</Text>
									<Text
										style={{
											fontSize: 15,
											color: theme.colors.gray600,
											fontWeight: "600",
											paddingBottom: 8,

											// textAlign: "center",
										}}
									>
										Chimi P.Wangdi
									</Text>
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
										uri: "https://plus.unsplash.com/premium_photo-1674571895797-3ca2aaf89eed?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNvbXBhbnklMjBsb2dvfGVufDB8fDB8fHww",
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
