import { mount, shallow } from "enzyme";
import React from "react";

import MainTable from "./MainTable/";
import TableCell from "./Table/TableCell/TableCell";
import { compareJSX } from "../../testing/utils";

function setupHeaders() {
  return [
    { content: "Status" },
    { content: "Cores", className: "u-align--right" },
    { content: "RAM", className: "u-align--right" },
    { content: "Disks", className: "u-align--right" }
  ];
}

function setupRows() {
  return [
    {
      columns: [
        { content: "Ready", role: "rowheader" },
        { content: 1, className: "u-align--right" },
        { content: "1 GiB", className: "u-align--right" },
        { content: 2, className: "u-align--right" }
      ]
    },
    {
      columns: [
        { content: "Waiting", role: "rowheader" },
        { content: 1, className: "u-align--right" },
        { content: "1 GiB", className: "u-align--right" },
        { content: 2, className: "u-align--right" }
      ]
    },
    {
      columns: [
        { content: "Idle", role: "rowheader" },
        { content: 8, className: "u-align--right" },
        { content: "3.9 GiB", className: "u-align--right" },
        { content: 3, className: "u-align--right" }
      ]
    }
  ];
}

function setupSortableTable() {
  let headers = setupHeaders();
  let rows = setupRows();
  headers[0].sortKey = "status";
  headers[1].sortKey = "cores";
  headers[2].sortKey = "ram";
  rows[0].sortData = {
    status: "ready",
    cores: 2,
    ram: 1
  };
  rows[1].sortData = {
    status: "waiting",
    cores: 1,
    ram: 1
  };
  rows[2].sortData = {
    status: "idle",
    cores: 8,
    ram: 3.9
  };
  return { headers, rows };
}

describe("MainTable", () => {
  const headers = setupHeaders();
  const rows = setupRows();

  it("renders", () => {
    const wrapper = shallow(<MainTable headers={headers} rows={rows} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("can be expanding", () => {
    rows.push({
      columns: [
        { content: "Expanding", role: "rowheader" },
        { content: 1, className: "u-align--right" },
        { content: "1.9 GiB", className: "u-align--right" },
        { content: 2, className: "u-align--right" }
      ],
      expanded: true,
      expandedContent: <div>Expand this</div>
    });
    const wrapper = shallow(
      <MainTable expanding={true} headers={headers} rows={rows} />
    );
    expect(wrapper.prop("expanding")).toBe(true);
    const heads = wrapper.find("TableHeader");
    // There should be an additional hidden table header to account for the
    // expanding cell
    expect(heads).toHaveLength(headers.length + 1);
    expect(heads.last().prop("className")).toContain("u-hide");
    const columns = wrapper
      .find("TableRow")
      .last()
      .find("TableCell");
    // There should be an additional table cell for the expanding content.
    expect(columns).toHaveLength(rows[rows.length - 1].columns.length + 1);
    compareJSX(
      columns.last(),
      <TableCell expanding={true} hidden={false}>
        <div>Expand this</div>
      </TableCell>
    );
  });

  it("can be responsive", () => {
    const wrapper = shallow(
      <MainTable headers={headers} responsive={true} rows={rows} />
    );
    expect(wrapper.prop("responsive")).toBe(true);
  });

  describe("sorting", () => {
    const headers = setupHeaders();
    const rows = setupRows();
    const sortedTable = setupSortableTable();
    it("can be sortable", () => {
      const wrapper = shallow(
        <MainTable
          headers={sortedTable.headers}
          rows={sortedTable.rows}
          sortable={true}
        />
      );
      // Sortable headers should have the sort prop set.
      expect(
        wrapper
          .find("TableHeader")
          .first()
          .prop("sort")
      ).toStrictEqual("none");
      // non-sortable headers should not have the sort prop set.
      expect(
        wrapper
          .find("TableHeader")
          .last()
          .prop("sort")
      ).toStrictEqual(undefined);
    });

    it("can limit the number of rows shown", () => {
      const wrapper = shallow(
        <MainTable headers={headers} rowLimit={2} rows={rows} sortable={true} />
      );
      expect(wrapper.find("tbody TableRow")).toHaveLength(2);
    });

    it("can set a start point for the visible rows", () => {
      const rows = setupRows();
      const wrapper = shallow(
        <MainTable
          headers={headers}
          rowLimit={2}
          rowStartIndex={2}
          rows={rows}
          sortable={true}
        />
      );
      const rowItems = wrapper.find("tbody TableRow");
      expect(rowItems).toHaveLength(1);
      expect(
        rowItems
          .at(0)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Idle");
    });

    it("can sort when clicking on a header", () => {
      const wrapper = shallow(
        <MainTable
          headers={sortedTable.headers}
          rows={sortedTable.rows}
          sortable={true}
        />
      );
      let rowItems = wrapper.find("tbody TableRow");
      // Check the initial status order.
      expect(
        rowItems
          .at(0)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Ready");
      expect(
        rowItems
          .at(1)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Waiting");
      expect(
        rowItems
          .at(2)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Idle");
      wrapper
        .find("TableHeader")
        .first()
        .simulate("click");
      wrapper.update();
      rowItems = wrapper.find("tbody TableRow");
      // The status should now be ascending.
      expect(
        rowItems
          .at(0)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Idle");
      expect(
        rowItems
          .at(1)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Ready");
      expect(
        rowItems
          .at(2)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Waiting");
      wrapper
        .find("TableHeader")
        .first()
        .simulate("click");
      wrapper.update();
      rowItems = wrapper.find("tbody TableRow");
      // The status should now be descending.
      expect(
        rowItems
          .at(0)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Waiting");
      expect(
        rowItems
          .at(1)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Ready");
      expect(
        rowItems
          .at(2)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Idle");
      wrapper
        .find("TableHeader")
        .first()
        .simulate("click");
      wrapper.update();
      rowItems = wrapper.find("tbody TableRow");
      // The status be back to the original order.
      expect(
        rowItems
          .at(0)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Ready");
      expect(
        rowItems
          .at(1)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Waiting");
      expect(
        rowItems
          .at(2)
          .find("TableCell")
          .first()
          .children()
          .text()
      ).toStrictEqual("Idle");
    });

    it("can set a default sort", () => {
      const wrapper = shallow(
        <MainTable
          defaultSort="status"
          defaultSortDirection="descending"
          headers={sortedTable.headers}
          rows={rows}
          sortable={true}
        />
      );
      expect(
        wrapper
          .find("TableHeader")
          .first()
          .prop("sort")
      ).toStrictEqual("descending");
    });

    it("updates sort when props change", () => {
      const wrapper = mount(
        <MainTable
          defaultSort="status"
          defaultSortDirection="descending"
          headers={sortedTable.headers}
          rows={rows}
          sortable={true}
        />
      );
      let heads = wrapper.find("TableHeader");
      expect(heads.first().prop("sort")).toStrictEqual("descending");
      expect(heads.at(1).prop("sort")).toStrictEqual("none");
      wrapper.setProps({
        defaultSort: "cores",
        defaultSortDirection: "ascending"
      });
      wrapper.update();
      heads = wrapper.find("TableHeader");
      expect(heads.first().prop("sort")).toStrictEqual("none");
      expect(heads.at(1).prop("sort")).toStrictEqual("ascending");
    });
  });
});
