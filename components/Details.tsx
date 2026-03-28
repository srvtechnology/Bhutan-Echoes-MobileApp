import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { theme } from "@/theme/theme";
import moment from "moment";
import { PlayCircle } from "lucide-react-native";
import CategoryTabs from "./CategoryTabs";
import { mediaUrl } from "@/config";

export default function Details({eventData, handleSpeakerNavigation,onWatchClick}: {eventData: any, handleSpeakerNavigation: (data: any) => void,
  onWatchClick: (data: any) => void
}) {
  
	return (
		<>
			{/* Featured Event */}
			{eventData && (
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
								backgroundColor: "#e7eedf",
								borderRadius: 24,
								padding: 16,
							}}
						>
							<Text
								style={{
									fontSize: 12,
									color: theme.colors.primary,
									fontFamily: theme.typography.fontFamily.regular,
									paddingBottom: 4,
								}}
							>
								Happening Now
							</Text>
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
										flex: 1,
										lineHeight: 20,
									}}
								>
									{eventData?.event_details?.eventname}{" "}
									{eventData?.guest_speaker?.length}
								</Text>
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
									{eventData?.guest_speaker?.length > 0 &&
										eventData?.guest_speaker.map((speaker: any) => (
											<View
												key={speaker.id}
												style={{
													backgroundColor: theme.colors.primary,
													borderRadius: 12,
													paddingHorizontal: 12,
													paddingVertical: 6,
													flexDirection: "row",
													alignItems: "center",
													width: 130,
												}}
											>
												<Image
													source={{
														uri: `${mediaUrl}/${speaker.speaker_image}`,
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
														fontFamily: theme.typography.fontFamily.regular,
														flexShrink: 1,
													}}
												>
													{speaker.speaker_name}
												</Text>
											</View>
										))}
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
									{moment(
										eventData?.event_details?.start_time,
										"HH:mm:ss",
									).format("h:mm A")}
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
									{eventData?.event_details?.venue}
								</Text>
								<TouchableOpacity
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "center",
										marginLeft: 10,
									}}
									onPress={() => onWatchClick(eventData?.event_details)
										
									}
								>
									<PlayCircle width={20} height={20} color={"red"} />
									<Text
										style={{
											color: theme.colors.gray700,
											marginLeft: 4,
											fontFamily: theme.typography.fontFamily.regular,
											fontSize: 10,
										}}
									>
										Watch
									</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			)}

			{/* Category Tabs */}
			{eventData?.categories?.length > 0 && (
				<CategoryTabs
					data={{
						categories: eventData?.categories,
						venue: eventData?.event_details?.venue,
					}}
          handleSpeakerNavigation={handleSpeakerNavigation}
				/>
			)}
		</>
	);
}
