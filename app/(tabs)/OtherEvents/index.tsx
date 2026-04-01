import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import React, { useEffect } from "react";
import Header from "@/components/header";
import { theme } from "@/theme/theme";
import { router } from "expo-router";
import { PlayCircle } from "lucide-react-native";

export default function OtherEvents() {
  const events = [
    {
      id: "1",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "2",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: true,
    },
    {
      id: "3",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "4",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "5",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: true,
    },
    {
      id: "6",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
    {
      id: "7",
      title: "The Wisdom of Balance: The Great Fourth's Legacy",
      status: "Happening Now",
      isFeatured: false,
    },
  ];

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
          Other Events
        </Text>
        <FlatList
          style={{ backgroundColor: theme.colors.bg, paddingHorizontal: 16 }}
          data={events}
          keyExtractor={(e) => e.id}
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
              onPress={() => {}}
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
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.primary,
                          fontFamily: theme.typography.fontFamily.regular,
                          paddingBottom: 4,
                        }}
                      >
                        Talks | Workshops | Dialogue
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
                            // flex: 1,
                            lineHeight: 20,
                          }}
                        >
                          The Wisdom of Balance. The Great Fourth's Legacy
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: "50%", alignItems: "flex-end" }}>
                      <Image
                        source={{
                          uri: "https://cdn.pixabay.com/photo/2024/08/21/11/11/young-man-8985888_1280.png",
                        }}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 60,
                        }}
                      />
                    </View>
                  </View>
                  {/* <View
                    style={{
                      height: 2,
                      backgroundColor: theme.colors.gray300,
                      marginVertical: 10,
                    }}
                  /> */}

                  {/* Time and Location */}
                  {/* <View
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
                      6:30 PM
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
                      RUBI Hall
                    </Text>
                  </View> */}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
