
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface AchievementsInputProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export const AchievementsInput = ({ achievements, onChange }: AchievementsInputProps) => {
  const [newAchievement, setNewAchievement] = useState("");

  const addAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      onChange([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    onChange(achievements.filter(achievement => achievement !== achievementToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">Key Achievements</Label>
      </div>
      
      <div className="flex gap-2">
        <Input
          placeholder="Add an achievement"
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addAchievement()}
        />
        <Button onClick={addAchievement}>
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </div>
      
      <div className="space-y-2">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
          >
            <span className="flex-1">{achievement}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeAchievement(achievement)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
