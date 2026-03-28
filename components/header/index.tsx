/** @format */

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { ArrowLeft, Bell, MoveLeft } from "lucide-react-native";
import { router } from "expo-router";
import { theme } from "@/theme/theme";

const Header = ({ back = true }: { back?: boolean }) => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
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
          {/* <TouchableOpacity
            style={{
              backgroundColor: "#33b564",
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 8,
              alignSelf: "flex-end",
              marginVertical: 10,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 12,
                fontFamily: theme.typography.fontFamily.regular,
              }}
            >
              DONATE
            </Text>
          </TouchableOpacity> */}
          <View
            style={{
              paddingLeft: back ? 0 : 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {back && (
              <TouchableOpacity
                style={{ padding: 4, marginRight: 4 }}
                onPress={() => router.back()}
              >
                <ArrowLeft size={24} color={theme.colors.text} />
              </TouchableOpacity>
            )}
            <View>
              <Text
                style={{
                  fontSize: 26,
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily.semiBold,
                }}
              >
                2026{" "}
                <Text
                  style={{
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  | Bhutan Echoes
                </Text>
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.gray600,
                    fontFamily: theme.typography.fontFamily.medium,
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
                    fontFamily: theme.typography.fontFamily.medium,
                  }}
                >
                  Drukyul's Literature and Arts Festival
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default Header;
