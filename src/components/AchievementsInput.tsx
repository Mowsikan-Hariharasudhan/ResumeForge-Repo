
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface AchievementsInputProps {
  achievements: string[];
  onChange: (achievements: string[]) => void;
}

export const AchievementsInput = ({ achievements, onChange }: AchievementsInputProps) => {
  const [newAchievement, setNewAchievement] = useState("");
  const isMobile = useIsMobile();

  const addAchievement = () => {
    if (newAchievement.trim() && !achievements.includes(newAchievement.trim())) {
      onChange([...achievements, newAchievement.trim()]);
      setNewAchievement("");
    }
  };

  const removeAchievement = (achievementToRemove: string) => {
    onChange(achievements.filter(achievement => achievement !== achievementToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAchievement();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-medium text-gray-700">Key Achievements</Label>
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
        <Input
          placeholder="Add an achievement"
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          onKeyPress={handleKeyPress}
          className={`${isMobile ? 'h-12' : ''}`}
        />
        <Button 
          onClick={addAchievement}
          className={isMobile ? 'w-full h-12' : ''}
          disabled={!newAchievement.trim()}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Achievement
        </Button>
      </div>
      
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className={`flex items-start justify-between p-3 border rounded-lg bg-gray-50 ${isMobile ? 'flex-col gap-3' : ''}`}
          >
            <span className={`flex-1 text-sm ${isMobile ? 'text-base' : ''}`}>
              {achievement}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeAchievement(achievement)}
              className={`${isMobile ? 'w-full h-10' : 'ml-2'} text-red-600 hover:text-red-700`}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              {isMobile ? 'Remove' : ''}
            </Button>
          </div>
        ))}
        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="mb-2">✨</div>
            <p className="text-sm">No achievements added yet</p>
            <p className="text-xs text-gray-400 mt-1">Add your key accomplishments to stand out</p>
          </div>
        )}
      </div>
    </div>
  );
};
