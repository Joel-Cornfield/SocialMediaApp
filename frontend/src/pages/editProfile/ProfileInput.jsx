import {
    IconBrandGithub,
    IconCheck,
    IconEdit,
    IconWorld,
  } from "@tabler/icons-react";

  const Icons = {
    IconBrandGithub: <IconBrandGithub />,
    IconWorld: <IconWorld />,
  };

  const ProfileInput = ({
    iconName,
    fieldState,
    fieldName,
    editingField,
    setEditingField,
    setField, 
    className = "profile-bio",
    maxLength,
    minLength,
    pattern,
    title,
    inputType = "input",
    fieldLabel,
  }) => {
    const isEditing = editingField === fieldName;
    const InputComponent = inputType;
    
    return (
        <div className="edit-input">
            {Icons[iconName]}

            {isEditing ? (
                <>
                    <InputComponent
                        type="text"
                        onChange={(e) => setField(e.target.value)}
                        className={className}
                        value={fieldState}
                        maxLength={maxLength}
                        minLength={minLength}
                        pattern={pattern}
                        title={title}
                    />
                    <IconCheck onClick={() => setEditingField("")} />
                </>
            ) : (
                <>
                    <p className={className}>{fieldState}</p>
                    <IconEdit onClick={() => setEditingField(fieldName)} />
                    {fieldLabel && <p className="input-label">{fieldLabel}</p>}
                </> 
            )}
        </div>
    );
};

export default ProfileInput;