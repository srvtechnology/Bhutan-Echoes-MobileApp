import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect } from "react";
import { theme } from "@/theme/theme";
import { useEventStore } from "@/store/eventStore";

export default function Sponsers() {
	// const { sponsors, fetchEvents, fetchSponsors } = useEventStore();

	// useEffect(() => {
	//   fetchEvents();
	//   fetchSponsors();
	// }, []);

	const sponsors = [
		{
			id: 1,
			url: require("../assets/images/sponser.png"),
		},
	];
	return (
		<View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
			<Text
				style={{
					fontSize: 12,
					fontFamily: theme.typography.fontFamily.medium,
					color: theme.colors.primary,
				}}
			>
				Our Sponsors
			</Text>
			<View
				style={{
					// flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					// paddingVertical: 12,
				}}
			>
				<View
					style={{
						elevation: 8,
						backgroundColor: theme.colors.bg,
						borderRadius: 20,
						shadowColor: theme.colors.gray400,
						shadowOffset: { width: 0, height: 4 },
						shadowOpacity: 0.3,
						shadowRadius: 4.65,
					}}
				>
					<Image
						source={sponsors[0].url}
						resizeMode="contain"
						style={{
							width: 170,
							height: 170,
							marginTop: 10,
						}}
					/>
				</View>
				{/* <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sponsors.map((sponsor) => (
            <View
              key={sponsor.id}
              style={{
                marginRight: 6,
              }}
            >
              <Image
                source={sponsor.url}
                resizeMode="contain"
                style={{
                  width: 100,
                  height: 100,
                }}
              />
            </View>
          ))}
        </ScrollView> */}
			</View>
		</View>
	);
}
