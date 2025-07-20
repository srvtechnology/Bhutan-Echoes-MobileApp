import {
  View,
  Text,
  StyleSheet,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { FileText, PlayCircle } from "lucide-react-native";

export default function ResourceFilter({
  showFilterModal,
  setShowFilterModal,
  setSelectedFilter,
}: {
  showFilterModal: boolean;
  setShowFilterModal: (e: boolean) => void;
  setSelectedFilter: (e: "All" | "PDF" | "Audio") => void;
}) {
  return (
    <Modal
      visible={showFilterModal}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Resource Type</Text>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSelectedFilter("PDF");
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterIconContainer}>
                <FileText size={41} color="#FF6B6B" />
              </View>
              <Text style={styles.filterOptionText}>PDF</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSelectedFilter("Audio");
                setShowFilterModal(false);
              }}
            >
              <View style={styles.filterIconContainer}>
                <PlayCircle size={41} color="#48732C" />
              </View>
              <Text style={styles.filterOptionText}>Audio</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.clearFilterButton}
            onPress={() => {
              setSelectedFilter("All");
              setShowFilterModal(false);
            }}
          >
            <Text style={styles.clearFilterText}>Show All Resources</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 50,
    marginTop: 60,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "interMedium",
    color: "#00",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#48732C",
    fontFamily: "interMedium",
  },
  filterOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    // paddingVertical: 40,
    paddingHorizontal: 10,
  },
  filterOption: {
    alignItems: "center",
    padding: 20,
  },
  filterIconContainer: {
    width: 120,
    height: 80,
    backgroundColor: "#dddddd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  filterOptionText: {
    fontSize: 16,
    fontFamily: "inter",
    color: "#000",
  },
  clearFilterButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    backgroundColor: "#dddddd",
    paddingVertical: 15,
    alignItems: "center",
  },
  clearFilterText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "inter",
  },
});
