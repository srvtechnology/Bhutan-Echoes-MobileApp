import { View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import { useEventStore } from "@/store/eventStore";
import { mediaUrl } from "@/config";
import moment from "moment";

export default function DaySchedule({
	dates,
	venue,
  handleSpeakerClick
}: {
	dates: any[];
	venue: string;
  handleSpeakerClick: (date: any) => void
}) {
  const width = useWindowDimensions().width
	const [selectedDay, setSelectedDay] = useState(0);

	const handleEventPress = (speaker: any) => {
    handleSpeakerClick({speaker, selectedCategory:dates[selectedDay]?.category_name })
	};

	const isFewItems = dates?.length <= 4;

	return (
		<View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
			<View
				style={{
					marginBottom: 12,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: theme.colors.background
				}}
			>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						minWidth: "100%",
						alignItems: "center",
             backgroundColor: "#e7eedf",
					}}
				>
					{dates.length > 0 &&
						dates.map((day, idx) => (
							<TouchableOpacity
								key={day.day + idx}
								style={{
									paddingHorizontal: 22,
									paddingVertical: 8,
									backgroundColor:
										day === selectedDay ? theme.colors.primary : "#e7eedf",
									flex: isFewItems ? 1 : undefined,
									marginHorizontal: isFewItems ? 4 : 0,
									alignItems: "center",
                  // justifyContent: 'center',
								}}
								onPress={() => setSelectedDay(idx)}
							>
								<Text
									style={{
										fontSize: 12,
										color: theme.colors.text,
										fontFamily: theme.typography.fontFamily.medium,
									}}
								>
									{day.day}
								</Text>
							</TouchableOpacity>
						))}
				</ScrollView>
			</View>

			{/* Event Cards */}
			{dates[selectedDay]?.speakers?.length > 0 ? (
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					style={{
						width: "96%",
						alignSelf: "center",
					}}
				>
					{dates[selectedDay]?.speakers?.map((speaker:any) => (
						<TouchableOpacity
							key={speaker.id}
							onPress={() => handleEventPress(speaker)}
							style={{
								// width: width * 0.35,
								alignItems: "center",
							}}
						>
							<Image
								source={{
									uri: `${speaker?.speaker_image}`,
								}}
								style={{
									width: 70,
									height: 70,
									borderRadius: 40,
									marginBottom: 8,
									backgroundColor: theme.colors.primary,
								}}
							/>
							<Text
								style={{
									fontSize: 10,
									color: theme.colors.text,
									textAlign: "center",
									fontFamily: theme.typography.fontFamily.regular,
									height: 30,
									width: 80,
								}}
								numberOfLines={2}
							>
								{speaker?.topic_name}
							</Text>
							<View
								style={{
									height: 2,
									backgroundColor: theme.colors.gray300,
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
									fontFamily: theme.typography.fontFamily.regular,
								}}
							>
								{moment(speaker?.start_time, "HH:mm:ss").format("hh:mm A")}
							</Text>
							<Text
								style={{
									fontSize: 10,
									color: theme.colors.gray600,
									fontFamily: theme.typography.fontFamily.regular,
								}}
							>
								{venue}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			) : (
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							color: theme.colors.primary,
							fontSize: 12,
							fontFamily: theme.typography.fontFamily.medium,
						}}
					>
						No speaker found
					</Text>
				</View>
			)}
		</View>
	);
}
