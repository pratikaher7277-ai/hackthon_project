from fastapi.testclient import TestClient

from omnichannel.api import create_app
from omnichannel.models import Channel
from omnichannel.simulation import ChannelSimSpec, build_simulated_agents


def client():
    specs = [ChannelSimSpec(Channel.WEBSITE, 80), ChannelSimSpec(Channel.MOBILE_APP, 80, effect=0.05)]
    return TestClient(create_app(lambda: build_simulated_agents(specs)))


def test_health_and_channels():
    c = client()
    assert c.get("/health").json() == {"status": "ok"}
    assert [x["code"] for x in c.get("/api/v1/channels").json()] == ["A", "B", "C", "D", "E"]


def test_report_endpoint():
    r = client().get("/api/v1/report?days=7")
    assert r.status_code == 200
    body = r.json()
    assert body["schema_version"] == "1.0" and len(body["channels"]) == 2


def test_report_validates_params():
    assert client().get("/api/v1/report?days=0").status_code == 422
    assert client().get("/api/v1/report?days=999").status_code == 422


def test_dashboard_endpoints_exist():
    c = client()
    assert c.get("/api/v1/summary?days=7").status_code == 200
    assert c.get("/api/v1/ranking?days=7").status_code == 200
    assert c.get("/api/v1/chart-types").status_code == 200
    chart = c.get("/api/v1/chart/satisfaction_by_channel?days=7")
    assert chart.status_code == 200
    assert chart.json()["id"] == "satisfaction_by_channel"
