import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { theme } from "@/theme/theme";
import moment from "moment";
import Carousel from "react-native-reanimated-carousel";

export default function EventCards({ item, handleCardPress }: any) {
	return (
		<TouchableOpacity
			style={{
				marginBottom: 10,
				elevation: 8,
				shadowColor: theme.colors.gray400,
				shadowOffset: { width: 0, height: 4 },
				shadowOpacity: 0.2,
				shadowRadius: 4,
			}}
			onPress={() => handleCardPress(item)}
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
						// borderBottomWidth: item.isFeatured ? 4 : 0,
						// borderBottomColor: item.isFeatured
						//   ? theme.colors.primary
						//   : "transparent",
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
								{item.categories?.map((category: any, index: number) => (
									<Text
										key={category?.id}
										style={{
											fontSize: 12,
											color: theme.colors.primary,
											fontFamily: theme.typography.fontFamily.regular,
											paddingBottom: 4,
											lineHeight: 12,
										}}
									>
										{category?.name} |{" "}
									</Text>
								))}
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
							<Carousel
								width={120}
								height={120}
								data={item?.banner_images || []}
								renderItem={({ item }: any) => (
									<Image
										source={{
											uri: item,
										}}
										style={{
											width: 120,
											height: 120,
											borderRadius: 60,
										}}
									/>
								)}
								loop
								autoPlay
								autoPlayInterval={4000}
								style={{ borderRadius: 17 }}
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

					{/* Date, Time and Location */}
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
							{moment(item?.start_date, "YYYY-MM-DD").format("DD MMM YYYY")}
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
	);
}
