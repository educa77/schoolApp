import React, { useState, useEffect } from "react";
import { ApiClient } from "admin-bro";
import { Badge } from "@admin-bro/design-system";

const ManyToManyList = (props) => {
  const api = new ApiClient();
  const { record } = props;
  const [relations, setRelations] = useState([]);
  const [roleRecords, setRoleRecords] = useState([]);
  const [thisRoles, setThisRoles] = useState([]);
  const [error, setError] = useState(false);

  const getRoleUsers = async (id) => {
    let result = await api.searchRecords({
      resourceId: "users_role",
      query: "",
    });
    if (!result.length) return false;
    setRelations(result.filter((el) => el.params.userId == id));
  };

  const getRoles = async () => {
    let result = await api.searchRecords({
      resourceId: "roles",
      query: "",
    });
    if (!result.length) return false;
    setRoleRecords(result.map((el) => ({ id: el.id, name: el.params.name })));
  };

  useEffect(() => {
    getRoleUsers(record.id);
    getRoles();
  }, [record]);

  const getThisRoles = () => {
    return relations.map((rel) => {
      let rec = roleRecords.filter((role) => role.id == rel.params.roleId);
      return {
        name: rec[0].name,
        variant:
          rec[0].name === "staff"
            ? "primary"
            : rec[0].name === "student"
            ? "success"
            : rec[0].name === "pm"
            ? "secondary"
            : "text",
      };
    });
  };

  useEffect(() => {
    if (relations.length && roleRecords.length) {
      setThisRoles(getThisRoles());
    }
  }, [relations, roleRecords]);

  const badgeWrapper = {
    display: "inline-block",
    padding: "5px 5px 5px 0",
  };

  return (
    <>
      {!error && thisRoles.length ? (
        <>
          {thisRoles.map((item, key) => (
            <span style={badgeWrapper} key={key}>
              <Badge key={key} variant={item.variant}>
                {item.name}
              </Badge>
            </span>
          ))}
        </>
      ) : (
        <span className="lds-facebook">-</span>
      )}
    </>
  );
};

export default ManyToManyList;
