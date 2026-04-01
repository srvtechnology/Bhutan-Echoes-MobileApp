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
			console.log("==== All Events ====", data?.data);

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
							<TouchableOpacity
								style={{
									marginBottom: 10,
									elevation: 8,
									shadowColor: theme.colors.gray400,
									shadowOffset: { width: 0, height: 4 },
									shadowOpacity: 0.2,
									shadowRadius: 4,
								}}
								onPress={() =>
									router.push({
										pathname: "/Schedule/details",
										params: { id: item.id },
									})
								}
							>
								<View
									style={{
										// padding: 16,
										borderRadius: 24,
										overflow: "hidden",
										backgroundColor: "white",
									}}
								>
									<View
										style={{
											backgroundColor: theme.colors.back,
											padding: 16,
											borderBottomWidth: item.isFeatured ? 4 : 0,
											borderBottomColor: item.isFeatured
												? theme.colors.primary
												: "transparent",
										}}
									>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
											}}
										>
											<View style={{ width: "50%" }}>
												<View
													style={{
														flexDirection: "row",
														flexWrap: "wrap",
														marginBottom: 6,
													}}
												>
													{item.categories?.map(
														(category: any, index: number) => (
															<Text
																key={category?.id}
																style={{
																	fontSize: 12,
																	color: theme.colors.primary,
																	fontFamily:
																		theme.typography.fontFamily.regular,
																	paddingBottom: 4,
																	lineHeight: 12,
																}}
															>
																{category?.name} |{" "}
															</Text>
														),
													)}
												</View>

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
														{item?.eventname}
													</Text>
												</View>
											</View>
											<View style={{ width: "50%", alignItems: "flex-end" }}>
												<Image
													source={{
														uri: `${mediaUrl}/${item?.banner_images}`,
													}}
													style={{
														width: 120,
														height: 120,
														borderRadius: 60,
													}}
												/>
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
												{moment(item?.start_time, "HH:mm:ss").format("hh:mm A")}
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
												{item?.venue}
											</Text>
										</View>
									</View>
								</View>
							</TouchableOpacity>
						)}
					/>
				)}
			</View>
		</View>
	);
}
