defmodule HolaMixTest do
  use ExUnit.Case
  doctest HolaMix

  test "greets the world" do
    assert HolaMix.hello() == :world
  end
end
