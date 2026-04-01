import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import DaySchedule from "./DaySchedule";

export default function CategoryTabs({ data, handleSpeakerNavigation }: {data: any, handleSpeakerNavigation: (data: any) => void}) {
	// Ensure categories is an array
	const categoryArray = Array.isArray(data.categories) ? data.categories : [];

	if (categoryArray.length === 0) return null;

	const [selectedDate, setSelectedDate] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setSelectedDate(categoryArray[0]);
	}, []);

	const isFewItems = categoryArray?.length <= 3;

  const handleCategorySelect = (idx: number) => {
    setLoading(true)
    setSelectedDate(categoryArray[idx])
    setTimeout(() => {
      setLoading(false)
    },500)
  };

  const onClickSpeaker = (e:any) => {
    const paramData = {
      categories: JSON.stringify(categoryArray) || [],
      venue: data.venue || "",
      speaker: JSON.stringify(e.speaker) || "",
      category: e.selectedCategory || ""

    }
		handleSpeakerNavigation(paramData)
  }

	return (
		<View
			style={{
				// paddingHorizontal: 16,
				paddingVertical: 26,
			}}
		>
			<View style={{ alignItems: "center", paddingHorizontal: 12  }}>
			<ScrollView
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					// justifyContent: isFewItems ? "space-between" : "flex-start",
					alignItems: "center",
					flex: isFewItems ? 1 : 0,
          paddingHorizontal:isFewItems ? 0 : 8,
				}}
			>
				{categoryArray.map((category: any, idx: number, arr: any) => (
					<TouchableOpacity
						key={category.id}
						style={{
							paddingRight: 12,
							paddingLeft: 12,
							paddingVertical: 6,
							borderRightWidth: idx !== arr.length - 1 ? 1 : 0,
							borderRightColor: theme.colors.gray300,
							marginBottom: 10,
							alignItems: "center",
							flex: isFewItems ? 1 : 0,
							backgroundColor: category.id === selectedDate.id ? theme.colors.back : "transparent",
						}}
						onPress={() => handleCategorySelect(idx)}
					>
						<Text
							style={{
								fontSize: 12,
								color: theme.colors.text,
								fontFamily: theme.typography.fontFamily.medium,
							}}
						>
							{category?.name}
						</Text>
					</TouchableOpacity>
				))}
			</ScrollView>
			</View>
			{/* Day Schedule */}
			{loading ? (
				<View style={{ alignItems: "center" }}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			) : selectedDate?.dates?.length > 0 ? (
				<DaySchedule dates={selectedDate?.dates} venue={data.venue} handleSpeakerClick={onClickSpeaker} />
			) : (
				<View style={{ alignItems: "center" }}>
					<Text
						style={{
							color: theme.colors.primary,
							fontSize: 12,
							fontFamily: theme.typography.fontFamily.medium,
						}}
					>
						No events found
					</Text>
				</View>
			)}
		</View>
	);
}
