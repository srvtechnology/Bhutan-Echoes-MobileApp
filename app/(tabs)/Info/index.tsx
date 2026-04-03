import { View, Text, ScrollView, Image } from "react-native";
import React from "react";
import { theme } from "@/theme/theme";
import Header from "@/components/header";

export default function Info() {
	return (
		<ScrollView
			style={{ flex: 1, backgroundColor: theme.colors.bg }}
			contentContainerStyle={{ backgroundColor: theme.colors.bg }}
		>
			<Header />
			<View style={{ padding: 26 }}>
				<Text
					style={{
						fontSize: 14,
						fontFamily: theme.typography.fontFamily.medium,
						color: theme.colors.gray700,
					}}
				>
					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laudantium
					sapiente temporibus suscipit eum, consequuntur recusandae quas
					exercitationem, explicabo beatae architecto, earum ipsam quis alias
					eaque magni deserunt? Magni, rem voluptates. {`\n \n`}Lorem ipsum
					dolor sitamet consectetur, adipisicing elit. Laudantium sapiente
					temporibus suscipit eum, consequuntur recusandae quas exercitationem,
					explicabo beatae architecto, earum ipsam quis alias eaque magni
					deserunt? Magni, rem voluptates.
					{`\n \n`}Lorem ipsum dolor sitamet consectetur, adipisicing elit.
					Laudantium sapiente temporibus suscipit eum, consequuntur recusandae
					quas exercitationem, explicabo beatae architecto, earum ipsam quis
					alias eaque magni deserunt? Magni, rem voluptates.
				</Text>
				``
				<View
					style={{
						flexDirection: "row",
						flexWrap: "wrap",
						marginTop: 20,
						gap: 4,
					}}
				>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
					<Image
						source={require("@/assets/images/sponser.png")}
						style={{ width: 100, height: 100, marginVertical: 20 }}
						resizeMode="contain"
					/>
				</View>
			</View>
		</ScrollView>
	);
}
