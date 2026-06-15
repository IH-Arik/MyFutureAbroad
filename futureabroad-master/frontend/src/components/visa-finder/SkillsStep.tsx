import type React from "react";

const SkillsStep: React.FC<any> = ({ SKILLS, profile, setProfile, t }) => {
  const toggle = (id: string) => {
    setProfile((prev: any) => ({
      ...prev,
      skills: prev.skills.includes(id) ? prev.skills.filter((s: string) => s !== id) : [...prev.skills, id],
    }));
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-foreground mb-1">{t("visa_finder.skills_title")}</h2>
      <p className="text-muted-foreground mb-7">{t("visa_finder.skills_hint")}</p>
      <div className="flex flex-wrap gap-3">
        {SKILLS.map((skill: any) => {
          const selected = profile.skills.includes(skill.id);
          return (
            <button
              key={skill.id}
              onClick={() => toggle(skill.id)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                selected
                  ? "border-[#8B6949] bg-[#8B6949]/10 text-[#8B6949] dark:text-[#D4C2A1]"
                  : "border-border bg-background text-foreground hover:border-[#8B6949]/50"
              }`}
            >
              {selected ? "✓ " : ""}{skill.label}
            </button>
          );
        })}
      </div>
    </>
  );
};

export default SkillsStep;
